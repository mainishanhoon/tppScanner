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
import {
  Armchair,
  BadgeAlert,
  BadgeInfo,
  CircleUser,
} from 'lucide-react';

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
          if (data.checkInDay1At) {
            data.checkInDay1At = new Date(data.checkInDay1At);
          }
          setUserData(data);
          setOpen(true);
        }),
      {
        loading: 'Searching User...',
        success: 'The Search is Complete',
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
          setUserData({
            ...userData,
            checkInDay1: true,
            checkInDay1At: new Date(data.checkInTime),
          });
          setOpen(false);
        }),
      {
        loading: 'Checking in...',
        success: 'Check-In Successful!',
        error: "Couldn't Check In",
      },
    );
  }

  return (
    <div className="relative h-dvh w-full p-4">
      <Scanner
        onScan={handleScan}
        onError={(error) => toast.error(`QR Error: ${error}`)}
        classNames={{
          video: 'size-full object-cover rounded-xl shadow-lg',
          container:
            'size-full absolute top-0 left-0 flex items-center justify-center bg-background',
        }}
        components={{ finder: false }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[300px] rounded-xl md:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {!error && !userData?.checkInDay1 && (
                <div>
                  <span className="flex size-20 items-center justify-center rounded-full bg-emerald-500/20">
                    <BadgeInfo
                      strokeWidth={2.5}
                      className="size-10 text-emerald-500"
                    />
                  </span>
                  <p className="text-xl text-emerald-500">
                    User Found! Check In?
                  </p>
                </div>
              )}
              {!error && userData?.checkInDay1 && (
                <div>
                  <span className="flex size-20 items-center justify-center rounded-full bg-amber-500/20">
                    <BadgeAlert
                      strokeWidth={2.5}
                      className="size-10 text-amber-500"
                    />
                  </span>
                  <p className="text-xl text-amber-500">
                    User has Already Checked In
                  </p>
                </div>
              )}
              {error && !userData && (
                <div>
                  <span className="bg-destructive/20 flex size-20 items-center justify-center rounded-full">
                    <BadgeAlert
                      strokeWidth={2.5}
                      className="text-destructive size-10"
                    />
                  </span>
                  <p className="text-destructive text-xl">
                    No Such User Exists
                  </p>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {!error && userData && (
            <div className="space-y-2 font-bold">
              <p className="text-lg">
                <CircleUser className="text-blue-500" />
                Name: {userData.name}
              </p>
              <p className="text-lg">
                <Armchair className="text-cyan-500" />
                Seat Number: {userData.seatNumber}
              </p>

              {!userData?.checkInDay1 && (
                <Button variant="constructive" onClick={handleCheckIn}>
                  Proceed with Check In
                </Button>
              )}

              {userData.checkInDay1 && (
                <div className="space-y-2">
                  <Badge variant="constructive" className="text-lg">
                    {Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'long',
                    }).format(userData.checkInDay1At)}
                  </Badge>
                  <p className="text-lg">at</p>
                  <Badge variant="constructive" className="text-lg">
                    {Intl.DateTimeFormat('en-IN', {
                      timeStyle: 'medium',
                    })
                      .format(userData.checkInDay1At)
                      .toUpperCase()}
                  </Badge>
                </div>
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
                  Scan Another QR
                </Button>
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
