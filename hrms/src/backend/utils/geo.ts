/**
 * أدوات حساب المسافات الجغرافية للتحقق من نطاق الموقع (Geofencing).
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * المسافة بين نقطتين على سطح الأرض بالأمتار باستخدام صيغة Haversine.
 */
export function distanceInMeters(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);

  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface GeofenceResult {
  withinRange: boolean;
  distanceMeters: number;
  allowedRadius: number;
}

/**
 * التحقق من وقوع موقع الموظف ضمن نطاق الفرع المسموح به.
 */
export function checkGeofence(
  employeeLocation: Coordinates,
  branchLocation: Coordinates,
  radiusMeters: number,
): GeofenceResult {
  const distanceMeters = distanceInMeters(employeeLocation, branchLocation);
  return {
    withinRange: distanceMeters <= radiusMeters,
    distanceMeters: Math.round(distanceMeters),
    allowedRadius: radiusMeters,
  };
}

/**
 * التحقق من صحة قيم الإحداثيات.
 */
export function isValidCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== 'object') return false;
  const { lat, lng } = value as Record<string, unknown>;
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
