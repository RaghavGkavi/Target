import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';

interface DeviceInfo {
  platform: 'web' | 'ios' | 'android';
  isNativeMobile: boolean;
  model?: string;
  operatingSystem?: string;
  osVersion?: string;
}

export function useMobileDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: 'web',
    isNativeMobile: false,
  });

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        setDeviceInfo({
          platform: info.platform as 'web' | 'ios' | 'android',
          isNativeMobile: info.platform !== 'web',
          model: info.model,
          operatingSystem: info.operatingSystem,
          osVersion: info.osVersion,
        });
      } catch (error) {
        // Fallback for web or when Capacitor is not available
        setDeviceInfo({
          platform: 'web',
          isNativeMobile: false,
        });
      }
    };

    getDeviceInfo();
  }, []);

  return deviceInfo;
}
