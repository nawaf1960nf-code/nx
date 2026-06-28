import { useCallback, useState } from 'react';

/**
 * خطّاف تحديد الموقع لتسجيل الحضور مع مؤشّرات مقاومة التزييف (Anti-Spoofing).
 *
 * يطلب دقة عالية ويمنع القراءات المخزّنة (maximumAge: 0) كي لا يُعاد إرسال
 * موقع قديم. ثم يفحص دقّة القراءة:
 *  - دقّة تساوي 0.0 بالضبط: مؤشّر قوي على موقع وهمي (Mock Location).
 *  - دقّة مثالية جداً (أقل من 10 أمتار) على الويب: مشبوهة وتستحق التدقيق.
 *
 * يُرسل العلم `isMocked` مع الإحداثيات إلى الخادم الذي يتّخذ القرار النهائي،
 * فالواجهة لا يُعتمد عليها وحدها في الأمان.
 */

export interface GeoReading {
  lat: number;
  lng: number;
  accuracy: number;
  isMocked: boolean;
  suspiciousAccuracy: boolean;
}

export interface GeolocationState {
  loading: boolean;
  reading: GeoReading | null;
  error: string | null;
  permission: PermissionState | 'unsupported';
}

const SUSPICIOUS_ACCURACY_METERS = 10;

const HIGH_ACCURACY_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
};

function mapPositionError(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'تم رفض الإذن بالوصول إلى الموقع.';
    case error.POSITION_UNAVAILABLE:
      return 'تعذّر تحديد الموقع حالياً.';
    case error.TIMEOUT:
      return 'انتهت مهلة تحديد الموقع، حاول مجدداً.';
    default:
      return 'حدث خطأ أثناء تحديد الموقع.';
  }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    reading: null,
    error: null,
    permission: 'unsupported',
  });

  /** قراءة حالة إذن الموقع في بيئة الويب/PWA إن كانت متاحة. */
  const checkPermission = useCallback(async (): Promise<PermissionState | 'unsupported'> => {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
      return 'unsupported';
    }
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      return status.state;
    } catch {
      return 'unsupported';
    }
  }, []);

  const requestLocation = useCallback(async (): Promise<GeoReading> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const permission = await checkPermission();

    return new Promise<GeoReading>((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        const message = 'خدمة تحديد الموقع غير متاحة على هذا الجهاز.';
        setState((prev) => ({ ...prev, loading: false, error: message, permission }));
        reject(new Error(message));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          const isMocked = accuracy === 0;
          const suspiciousAccuracy =
            typeof accuracy === 'number' && accuracy > 0 && accuracy < SUSPICIOUS_ACCURACY_METERS;

          const reading: GeoReading = {
            lat: latitude,
            lng: longitude,
            accuracy,
            isMocked,
            suspiciousAccuracy,
          };

          setState({ loading: false, reading, error: null, permission });
          resolve(reading);
        },
        (error) => {
          const message = mapPositionError(error);
          setState((prev) => ({ ...prev, loading: false, error: message, permission }));
          reject(new Error(message));
        },
        HIGH_ACCURACY_OPTIONS,
      );
    });
  }, [checkPermission]);

  return { ...state, requestLocation };
}
