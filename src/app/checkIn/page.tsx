'use client';

import { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Armchair,
  BadgeAlert,
  BadgeCheck,
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleScan(result: IDetectedBarcode[]) {
    if (!result.length) return;
    setError(null);

    toast.promise(
      fetch(`/api/checkIn/${result[0].rawValue}`)
        .then(async (response) => {
          if (!response.ok) {
            setError('No Such User Exists');
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data.checkInDay1At) {
            data.checkInDay1At = new Date(data.checkInDay1At);
          }
          setUserData(data);
        })
        .finally(() => {
          setOpen(true);
        }),
      {
        loading: 'Searching User...',
        success: 'User Found',
        error: 'No Such User Found',
      },
    );
  }

  async function handleCheckIn() {
    if (!userData) return;

    toast.promise(
      fetch(`/api/checkIn/${userData.id}`, { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
          setUserData({
            ...userData,
            checkInDay1: true,
            checkInDay1At: new Date(data.checkInTime),
          });
        })
        .finally(() => {
          setOpen(false);
        }),
      {
        loading: 'Checking In...',
        success: 'Check-In Successful',
        error: "Couldn't Check-In",
      },
    );
  }

  return (
    <div className="relative h-dvh">
      <Scanner
        onScan={handleScan}
        onError={(error) => toast.error(`QR Error: ${error}`)}
        classNames={{
          video: 'size-full object-cover rounded-xl shadow-lg z-20',
          container:
            'size-full absolute top-0 left-0 flex items-center justify-center',
        }}
        components={{ finder: false }}
      />

      <div className="text-foreground absolute inset-0 z-10 flex flex-col items-center justify-center text-center font-bold">
        <span className="size-40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
            <path
              fill="none"
              stroke="#000000"
              stroke-width="15"
              stroke-linecap="round"
              stroke-dasharray="300 385"
              stroke-dashoffset="0"
              d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
            >
              <animate
                attributeName="stroke-dashoffset"
                calcMode="spline"
                dur="2"
                values="685;-685"
                keySplines="0 0 1 1"
                repeatCount="indefinite"
              ></animate>
            </path>
          </svg>
        </span>
        <p className="-mt-5 text-xl">
          Accessing Phone Camera
          <br />
          Please Wait!!
        </p>
      </div>
      <div className="text-background absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 font-bold">
        <p>Align the QR code within the frame</p>

        <div className="relative flex h-64 w-64 items-center justify-center">
          <span className="border-background absolute top-0 left-0 size-14 border-t-4 border-l-4" />
          <span className="border-background absolute top-0 right-0 size-14 border-t-4 border-r-4" />
          <span className="border-background absolute bottom-0 left-0 size-14 border-b-4 border-l-4" />
          <span className="border-background absolute right-0 bottom-0 size-14 border-r-4 border-b-4" />
        </div>

        <p>Scanning will start automatically</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="outline-background bg-muted max-w-[300px] rounded-xl outline-2 outline-dashed md:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex justify-center text-2xl">
              {!error && !userData?.checkInDay1 && (
                <div className="flex flex-col items-center gap-3">
                  <span className="flex size-20 items-center justify-center rounded-full border border-dashed border-emerald-500 bg-emerald-500/20">
                    <BadgeCheck className="size-14 text-emerald-400" />
                  </span>
                  <p className="text-xl text-emerald-400">
                    User Found! Check In?
                  </p>
                </div>
              )}
              {!error && userData?.checkInDay1 && (
                <div className="flex flex-col items-center gap-3">
                  <span className="flex size-20 items-center justify-center rounded-full border border-dashed border-amber-500 bg-amber-500/20">
                    <BadgeInfo className="size-14 text-amber-400" />
                  </span>
                  <p className="text-xl text-amber-400">
                    User has Already Checked In
                  </p>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center gap-3">
                  <span className="bg-destructive/20 flex size-20 items-center justify-center rounded-full border border-dashed border-rose-500">
                    <BadgeAlert className="size-14 text-rose-400" />
                  </span>
                  <p className="text-xl text-rose-400">No Such User Exists</p>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {!error && userData && (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-background border-muted-foreground flex flex-col justify-center gap-2 rounded-lg border-2 border-dashed p-2">
                <span className="flex gap-2">
                  <CircleUser
                    strokeWidth={2.5}
                    className="font-medium text-blue-500"
                  />
                  <p className="font-medium capitalize">{userData.name}</p>
                </span>
                <span className="flex gap-2">
                  <Armchair
                    strokeWidth={2.5}
                    className="font-medium text-cyan-500"
                  />
                  <p className="font-medium">{userData.seatNumber}</p>
                </span>
              </div>

              {userData.checkInDay1 && (
                <div className="mt-4 flex flex-col items-center">
                  <Badge variant="constructive">
                    {Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'long',
                    }).format(userData.checkInDay1At)}
                  </Badge>
                  <p>at</p>
                  <Badge variant="constructive">
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

          <DialogFooter className="mt-5 flex flex-col items-center gap-3">
            {!error && !userData?.checkInDay1 && (
              <Button className="text-sm" onClick={handleCheckIn}>
                Proceed with Check-In
              </Button>
            )}
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="text-background bg-blue-500 text-sm shadow-sm hover:bg-blue-500/80"
            >
              Scan Another QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
