'use client';

import { useEffect } from 'react';
import { captureAcquisitionParams } from '@/lib/acquisition';

export default function AcquisitionTracker() {
  useEffect(() => {
    captureAcquisitionParams();
  }, []);

  return null;
}
