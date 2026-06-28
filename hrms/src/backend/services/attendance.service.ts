/**
 * خدمة الحضور والانصراف: التحقق من الموقع الجغرافي وحساب التأخير والتبكير
 * والعمل الإضافي آلياً بناءً على وردية الموظف وسياسة الحضور.
 */

import { Coordinates, checkGeofence, isValidCoordinates } from '../utils/geo';

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'EARLY_DEPARTURE'
  | 'HALF_DAY'
  | 'ON_LEAVE';

export interface ShiftDefinition {
  /** بصيغة 24 ساعة "HH:mm" مثل "08:00". */
  startTime: string;
  endTime: string;
  /** دقائق السماح قبل احتساب التأخير. */
  gracePeriodMinutes: number;
}

export interface AttendancePolicyRules {
  earlyDepartureThreshold: number;
  /** الحد الأدنى من الدقائق بعد نهاية الوردية ليُحتسب عملاً إضافياً. */
  overtimeMinThreshold: number;
}

export interface BranchGeofence {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface GeofenceVerification {
  accepted: boolean;
  distanceMeters: number | null;
  reason?: string;
}

export interface AttendanceComputation {
  status: AttendanceStatus;
  lateMinutes: number;
  earlyDepartureMinutes: number;
  overtimeMinutes: number;
  workedMinutes: number;
}

const DEFAULT_POLICY: AttendancePolicyRules = {
  earlyDepartureThreshold: 15,
  overtimeMinThreshold: 30,
};

/**
 * يحوّل وقت الوردية "HH:mm" إلى DateTime على نفس يوم المرجع المعطى.
 */
function shiftTimeToDate(reference: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10));
  const result = new Date(reference);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function diffMinutes(later: Date, earlier: Date): number {
  return Math.round((later.getTime() - earlier.getTime()) / 60000);
}

/**
 * التحقق من أن موقع تسجيل الحضور يقع ضمن نطاق الفرع المسموح.
 */
export function verifyCheckInLocation(
  location: unknown,
  branch: BranchGeofence,
): GeofenceVerification {
  if (!isValidCoordinates(location)) {
    return { accepted: false, distanceMeters: null, reason: 'إحداثيات الموقع غير صالحة.' };
  }

  const employeeLocation = location as Coordinates;
  const result = checkGeofence(
    employeeLocation,
    { lat: branch.latitude, lng: branch.longitude },
    branch.radiusMeters,
  );

  if (!result.withinRange) {
    return {
      accepted: false,
      distanceMeters: result.distanceMeters,
      reason: `الموقع خارج نطاق الفرع المسموح (${result.distanceMeters}م من أصل ${branch.radiusMeters}م).`,
    };
  }

  return { accepted: true, distanceMeters: result.distanceMeters };
}

/**
 * حساب التأخير/التبكير/العمل الإضافي وحالة اليوم بناءً على أوقات الوردية.
 *
 * يدعم الورديات الليلية (التي تنتهي في اليوم التالي) بضبط نهاية الوردية.
 */
export function computeAttendance(
  checkIn: Date | null,
  checkOut: Date | null,
  shift: ShiftDefinition,
  policy: AttendancePolicyRules = DEFAULT_POLICY,
): AttendanceComputation {
  if (!checkIn) {
    return {
      status: 'ABSENT',
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      overtimeMinutes: 0,
      workedMinutes: 0,
    };
  }

  const scheduledStart = shiftTimeToDate(checkIn, shift.startTime);
  let scheduledEnd = shiftTimeToDate(checkIn, shift.endTime);

  // وردية ليلية: نهاية الوردية في اليوم التالي.
  if (scheduledEnd.getTime() <= scheduledStart.getTime()) {
    scheduledEnd = new Date(scheduledEnd.getTime() + 24 * 60 * 60 * 1000);
  }

  // التأخير: يُحتسب من بداية الوردية ويُتجاوز ضمن فترة السماح.
  const rawLate = diffMinutes(checkIn, scheduledStart);
  const lateMinutes = rawLate > shift.gracePeriodMinutes ? rawLate : 0;

  let earlyDepartureMinutes = 0;
  let overtimeMinutes = 0;
  let workedMinutes = 0;

  if (checkOut) {
    workedMinutes = Math.max(0, diffMinutes(checkOut, checkIn));

    const earlyRaw = diffMinutes(scheduledEnd, checkOut);
    if (earlyRaw > policy.earlyDepartureThreshold) {
      earlyDepartureMinutes = earlyRaw;
    }

    const overtimeRaw = diffMinutes(checkOut, scheduledEnd);
    if (overtimeRaw >= policy.overtimeMinThreshold) {
      overtimeMinutes = overtimeRaw;
    }
  }

  const status = resolveStatus({
    hasCheckOut: Boolean(checkOut),
    lateMinutes,
    earlyDepartureMinutes,
    scheduledStart,
    scheduledEnd,
    workedMinutes,
  });

  return { status, lateMinutes, earlyDepartureMinutes, overtimeMinutes, workedMinutes };
}

function resolveStatus(args: {
  hasCheckOut: boolean;
  lateMinutes: number;
  earlyDepartureMinutes: number;
  scheduledStart: Date;
  scheduledEnd: Date;
  workedMinutes: number;
}): AttendanceStatus {
  const scheduledMinutes = diffMinutes(args.scheduledEnd, args.scheduledStart);

  // يوم ناقص إذا عمل أقل من نصف ساعات الوردية المقررة.
  if (args.hasCheckOut && scheduledMinutes > 0 && args.workedMinutes < scheduledMinutes / 2) {
    return 'HALF_DAY';
  }
  if (args.lateMinutes > 0) {
    return 'LATE';
  }
  if (args.earlyDepartureMinutes > 0) {
    return 'EARLY_DEPARTURE';
  }
  return 'PRESENT';
}

/**
 * احتساب أجر العمل الإضافي وفق نظام العمل السعودي (المادة 107):
 * أجر الساعة الإضافية = أجر الساعة + 50% منه.
 */
export function calculateOvertimePay(
  overtimeMinutes: number,
  monthlyWage: number,
  contractedHoursPerMonth = 240,
): number {
  if (overtimeMinutes <= 0) return 0;
  const hourlyWage = monthlyWage / contractedHoursPerMonth;
  const overtimeHours = overtimeMinutes / 60;
  const pay = overtimeHours * hourlyWage * 1.5;
  return Math.round((pay + Number.EPSILON) * 100) / 100;
}
