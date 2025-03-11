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
import { Badge } from '@/components/ui/badge';

interface UserData {
  id: string;
  name: string;
  seatNumber: string;
  checkInDay1: boolean;
  checkInDay1At: Date;
}

export default function QRScanner() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleScan(result: IDetectedBarcode[]) {
    if (!result.length) return;

    const userId = result[0].rawValue;
    setError(null);

    toast.promise(
      fetch(`/api/checkIn/${userId}`, { method: 'GET' })
        .then((res) => {
          if (!res.ok) {
            setError('No Such User exists');
            return;
          }
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setOpen(true);
        }),
      {
        loading: 'Searching User...',
        success: 'User Found!',
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
            setError(`User has Already Checked In`);
            return;
          }
          setUserData({
            ...userData,
            checkInDay1: true,
            checkInDay1At: data.checkInTime,
          });
          setError(null);
        }),
      {
        loading: 'Checking in...',
        success: 'Check-In Successful!',
        error: "Couldn't Check In",
      },
    );
  }

  return (
    <div className="relative h-screen w-full bg-black">
      <Scanner
        onScan={handleScan}
        onError={(error) => console.error(error)}
        classNames={{
          video: 'h-full w-full object-cover rounded-lg shadow-lg',
          container:
            'h-dvh w-dvw absolute top-0 left-0 flex items-center justify-center bg-background',
        }}
        components={{ finder: false }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[340px] md:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {!error && userData && 'Ready to Check In'}
              {error && userData && 'Already Checked In'}
              {error && !userData && 'User Not Found'}
            </DialogTitle>
          </DialogHeader>
          {!error && (
            <Button variant="constructive" onClick={handleCheckIn}>
              Check In
            </Button>
          )}
          {error && (userData || !userData) && (
            <Button variant="secondary" onClick={() => router.refresh()}>
              Scan Another QR
            </Button>
          )}
          {!error && userData && (
            <div className="space-y-2 font-bold">
              <p className="text-lg">👤 Name: {userData.name}</p>
              <p className="text-lg">🎟️ Seat Number: {userData.seatNumber}</p>

              <p className="text-emerald-500">
                ✅ User Checked In on
                <Badge variant="constructive">
                  {Intl.DateTimeFormat('en-IN', {
                    dateStyle: 'long',
                  }).format(userData.checkInDay1At)}
                </Badge>
                {' at '}
                <Badge variant="constructive">
                  {Intl.DateTimeFormat('en-IN', {
                    timeStyle: 'medium',
                  })
                    .format(userData.checkInDay1At)
                    .toUpperCase()}
                </Badge>
              </p>
            </div>
          )}

          {error && userData && (
            <div className="space-y-2 font-bold">
              <p className="text-lg">👤 Name: {userData.name}</p>
              <p className="text-lg">🎟️ Seat Number: {userData.seatNumber}</p>

              {userData.checkInDay1 && (
                <p className="text-destructive">
                  ℹ️ User has already checked in on
                  <Badge variant="pending">
                    {Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'long',
                    }).format(userData.checkInDay1At)}
                  </Badge>
                  {' at '}
                  <Badge variant="pending">
                    {Intl.DateTimeFormat('en-IN', {
                      timeStyle: 'medium',
                    })
                      .format(userData.checkInDay1At)
                      .toUpperCase()}
                  </Badge>
                </p>
              )}
            </div>
          )}

          {error && !userData && (
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
