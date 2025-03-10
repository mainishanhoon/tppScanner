'use client';

import { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';

interface UserData {
  id: string;
  name: string;
  seatNumber: string;
  checkInDay1: boolean;
  checkInDay1At: string | null;
}

export default function QRScanner() {
  const [userData, setUserData] = useState<UserData | null>(null);

  async function handleScan(result: IDetectedBarcode[]) {
    if (result.length > 0) {
      const userId = result[0].rawValue;

      try {
        const response = await fetch(`/api/checkIn/${userId}`);
        if (!response.ok) throw new Error('User not found');

        const data: UserData = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
        alert('Invalid QR Code or User not found.');
      }
    }
  }

  return (
    <div className="relative h-screen w-screen">
      <Scanner
        onScan={handleScan}
        onError={(error) => console.error(error)}
        classNames={{ container: 'h-full w-full absolute top-0 left-0' }}
      />

      {userData && (
        <div className="animate-slide-up absolute bottom-0 w-full rounded-t-3xl bg-white p-6 text-black shadow-lg dark:bg-gray-900 dark:text-white">
          <h2 className="text-xl font-bold">User Details</h2>
          <p className="text-lg">👤 Name: {userData.name}</p>
          <p className="text-lg">🎟️ Seat Number: {userData.seatNumber}</p>

          <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-lg font-semibold text-white hover:bg-blue-700">
            Check In
          </button>
        </div>
      )}
    </div>
  );
}
