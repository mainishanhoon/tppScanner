'use client';

import { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  name: string;
  seatNumber: string;
  checkInDay1: boolean;
  checkInDay1At: string | null;
}

export default function QRScanner() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  async function handleScan(result: IDetectedBarcode[]) {
    if (!result.length) return;

    const userId = result[0].rawValue;

    toast.promise(
      fetch(`/api/checkIn/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error('No Such User exists!!');
          return res.json();
        })
        .then((data) => setUserData(data))
        .then(() => router.refresh()),
      {
        loading: 'Searching User...',
        success: 'User Found Successfully',
        error: 'No Such User exists!!',
      },
    );
  }

  async function handleCheckIn() {
    if (!userData) return;

    toast.promise(
      fetch(`/api/checkIn/${userData.id}`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 400) {
            throw new Error(`Already Checked In at ${data.checkInTime}`);
          }
          setUserData({
            ...userData,
            checkInDay1: true,
            checkInDay1At: data.checkInTime,
          });
        }),
      {
        loading: 'Checking in...',
        success: 'Check-In Successful!',
        error: (err) => err.message,
      },
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black">
      <Scanner
        onScan={handleScan}
        onError={(error) => console.error(error)}
        classNames={{
          video: 'h-full w-full object-cover rounded-3xl shadow-lg',
          container:
            'h-dvh w-full flex aspect-auto items-center justify-center rounded-3xl',
        }}
      />

      {userData && (
        <div className="animate-slide-up absolute bottom-0 aspect-auto w-full rounded-t-3xl bg-white p-6 text-black shadow-lg dark:bg-gray-900 dark:text-white">
          <h2 className="text-xl font-bold">User Details</h2>
          <p className="text-lg">👤 Name: {userData.name}</p>
          <p className="text-lg">🎟️ Seat Number: {userData.seatNumber}</p>

          {userData.checkInDay1 ? (
            <p className="mt-4 text-red-500">
              ✅ Already Checked In at{' '}
              {new Date(userData.checkInDay1At!).toLocaleString()}
            </p>
          ) : (
            <button
              className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-lg font-semibold text-white hover:bg-blue-700"
              onClick={handleCheckIn}
            >
              Check In
            </button>
          )}
        </div>
      )}
    </div>
  );
}
