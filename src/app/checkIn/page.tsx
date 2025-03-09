'use client';

import { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';

export default function QRScanner() {
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = (result: IDetectedBarcode[]) => {
    if (result.length > 0) {
      setScannedData(result[0].rawValue);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Scanner onScan={handleScan} onError={(error) => console.error(error)} />

      {scannedData && (
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => alert(`Scanned ID: ${scannedData}`)}
        >
          Proceed with Check-In
        </button>
      )}
    </div>
  );
}
