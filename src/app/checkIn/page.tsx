'use client';

import { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Controls dialog visibility

  async function handleScan(result: IDetectedBarcode[]) {
    if (!result.length) return;

    const userId = result[0].rawValue;
    setError(null);

    toast.promise(
      fetch(`/api/checkIn/${userId}`, { method: 'GET' })
        .then((res) => {
          if (!res.ok) {
            toast.error('No Such User exists');
            return;
          }
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setOpen(true); // Open dialog when user is found
        })
        .catch((err) => {
          setError(err.message);
          setOpen(true); // Open dialog when user is not found
        }),
      {
        loading: 'Searching User...',
        success: 'User Found Successfully',
        error: 'Something Went Wrong',
      },
    );
  }

  async function handleCheckIn() {
    if (!userData) return;

    toast.promise(
      fetch(`/api/checkIn/${userData.id}`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 400) {
            toast.error(`Already Checked In at ${data.checkInTime}`);
            return;
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
    <div className="relative h-screen w-full bg-black">
      {/* QR Scanner */}
      <Scanner
        onScan={handleScan}
        onError={(error) => console.error(error)}
        classNames={{
          video: 'h-full w-full object-cover rounded-lg shadow-lg',
          container:
            'h-dvh w-dvw absolute top-0 left-0 flex items-center justify-center bg-black/80',
        }}
        components={{ finder: false }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {error ? 'User Not Found' : 'User Details'}
            </DialogTitle>
          </DialogHeader>

          {/* If User is Found, Show Details */}
          {!error && userData && (
            <div className="space-y-3">
              <p className="text-lg">👤 Name: {userData.name}</p>
              <p className="text-lg">🎟️ Seat Number: {userData.seatNumber}</p>

              {userData.checkInDay1 ? (
                <p className="text-red-500">
                  ✅ Already Checked In at{' '}
                  {new Date(userData.checkInDay1At!).toLocaleString()}
                </p>
              ) : (
                <Button className="w-full" onClick={handleCheckIn}>
                  Check In
                </Button>
              )}
            </div>
          )}

          {/* If User is Not Found, Show Close Button */}
          {error && (
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.refresh()}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
