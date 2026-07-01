/**
 * خدمة الحضور والانصراف: التحقق من الموقع الجغرافي وحساب التأخير والتبكير
 * والعمل الإضافي آلياً بناءً على وردية الموظف وسياسة الحضور.
 */

import { Coordinates, checkGeofence, distanceInMeters, isValidCoordinates } from '../utils/geo';
import { prisma } from '../config/database';
import { riyadhDayRange } from '../utils/datetime';

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

// ════════════════════════════════════════════════════════════════════
// تسجيل الحضور مع مقاومة تزييف الموقع (Anti-Spoofing)
// ════════════════════════════════════════════════════════════════════

export interface CheckInCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export type CheckInRejectionReason =
  | 'MOCK_LOCATION'
  | 'OUT_OF_RANGE'
  | 'INVALID_LOCATION'
  | 'NO_BRANCH';

export interface CheckInResult {
  success: boolean;
  reason?: CheckInRejectionReason;
  message: string;
  status?: AttendanceStatus;
  distanceMeters?: number;
  recordId?: string;
}

const DEFAULT_GEOFENCE_RADIUS = 100;

/** معرّفات مستخدمي الموارد البشرية النشطين لإرسال التنبيهات الأمنية. */
async function getHrUserIds(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { roleId: { in: ['HR_ADMIN', 'SUPER_ADMIN'] }, status: 'ACTIVE' },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

/**
 * تسجيل دخول الموظف مع التحقق من صحّة الموقع ومقاومة التطبيقات الوهمية.
 *
 * يُرفض التسجيل في الحالات التالية:
 *  - الموقع وهمي (isMocked) أو الدقة صفرية (مؤشّر قوي على Fake GPS).
 *  - الموقع خارج النطاق الجغرافي المسموح للفرع (Geofence).
 *
 * عند رصد موقع وهمي يُسجَّل تنبيه أمني في AuditLog ويُشعَر به فريق الموارد
 * البشرية.
 */
export async function checkIn(
  employeeId: string,
  coords: CheckInCoordinates,
  isMocked: boolean,
): Promise<CheckInResult> {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      id: true,
      userId: true,
      displayName: true,
      employeeNumber: true,
      region: {
        select: { id: true, name: true, latitude: true, longitude: true, geofenceRadius: true },
      },
      workShift: {
        select: { startTime: true, endTime: true, gracePeriodMinutes: true },
      },
    },
  });

  if (!employee) {
    return { success: false, reason: 'INVALID_LOCATION', message: 'الموظف غير موجود.' };
  }

  // 1) مقاومة الموقع الوهمي: الدقة الصفرية مؤشّر إضافي على التزييف.
  const looksMocked = isMocked || coords.accuracy === 0;
  if (looksMocked) {
    await prisma.auditLog.create({
      data: {
        userId: employee.userId ?? undefined,
        action: 'SECURITY_ALERT',
        entity: 'ATTENDANCE',
        entityId: employee.id,
        newValue: {
          message: 'محاولة تسجيل حضور بموقع وهمي',
          employeeNumber: employee.employeeNumber,
          coords: { lat: coords.lat, lng: coords.lng, accuracy: coords.accuracy ?? null },
        },
      },
    });

    const hrUserIds = await getHrUserIds();
    if (hrUserIds.length > 0) {
      await prisma.notification.createMany({
        data: hrUserIds.map((userId) => ({
          userId,
          title: 'تنبيه أمني: موقع وهمي',
          body: `محاولة تسجيل حضور بموقع وهمي من الموظف ${employee.displayName} (${employee.employeeNumber}).`,
          type: 'SECURITY_ALERT',
          data: { employeeId: employee.id },
        })),
      });
    }

    return {
      success: false,
      reason: 'MOCK_LOCATION',
      message: 'تم رفض تسجيل الحضور: تم رصد موقع وهمي.',
    };
  }

  // 2) التحقق من صحّة الإحداثيات وتوفّر فرع بإحداثيات.
  if (!isValidCoordinates({ lat: coords.lat, lng: coords.lng })) {
    return { success: false, reason: 'INVALID_LOCATION', message: 'إحداثيات الموقع غير صالحة.' };
  }

  const branch = employee.region;
  if (!branch || branch.latitude == null || branch.longitude == null) {
    return {
      success: false,
      reason: 'NO_BRANCH',
      message: 'لم يُضبط نطاق جغرافي لفرع الموظف.',
    };
  }

  // 3) قياس المسافة عبر معادلة Haversine ومقارنتها بنطاق الفرع.
  const distance = distanceInMeters(
    { lat: coords.lat, lng: coords.lng },
    { lat: branch.latitude, lng: branch.longitude },
  );
  const radius = branch.geofenceRadius ?? DEFAULT_GEOFENCE_RADIUS;

  if (distance > radius) {
    return {
      success: false,
      reason: 'OUT_OF_RANGE',
      message: 'أنت خارج نطاق العمل المسموح به.',
      distanceMeters: Math.round(distance),
    };
  }

  // 4) تسجيل الحضور وحساب حالة التأخير إن توفّرت الوردية.
  const now = new Date();
  const { start } = riyadhDayRange(now);

  let status: AttendanceStatus = 'PRESENT';
  let lateMinutes = 0;
  if (employee.workShift) {
    const computed = computeAttendance(now, null, {
      startTime: employee.workShift.startTime,
      endTime: employee.workShift.endTime,
      gracePeriodMinutes: employee.workShift.gracePeriodMinutes,
    });
    status = computed.status;
    lateMinutes = computed.lateMinutes;
  }

  const record = await prisma.attendanceRecord.upsert({
    where: { employeeId_date: { employeeId: employee.id, date: start } },
    create: {
      employeeId: employee.id,
      date: start,
      checkIn: now,
      checkInMethod: 'GPS',
      checkInLocation: { lat: coords.lat, lng: coords.lng, accuracy: coords.accuracy ?? null },
      status,
      lateMinutes,
    },
    update: {
      checkIn: now,
      checkInMethod: 'GPS',
      checkInLocation: { lat: coords.lat, lng: coords.lng, accuracy: coords.accuracy ?? null },
      status,
      lateMinutes,
    },
    select: { id: true },
  });

  return {
    success: true,
    message: 'تم تسجيل الحضور بنجاح.',
    status,
    distanceMeters: Math.round(distance),
    recordId: record.id,
  };
}
