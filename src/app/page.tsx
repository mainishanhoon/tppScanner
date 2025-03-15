'use client';

import { SubmitButton } from '@/components/Buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Form from 'next/form';
import { useState } from 'react';
import { Authenticate } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { BadgeAlert } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="flex h-dvh items-center justify-center px-6">
      <Card className="bg-muted w-[500px]">
        <CardHeader>
          <CardTitle className="text-3xl">Sign In</CardTitle>
          <CardDescription className="font-medium">
            Access CheckIn Route after Verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div className="bg-destructive/20 text-destructive flex items-center gap-2 rounded-sm p-2 text-sm">
              <BadgeAlert strokeWidth={2.5} />
              <p>{error}</p>
            </div>
          )}
          <Form
            action={async (formData) => {
              const result = await Authenticate(formData);
              if (result?.error) {
                setError(result.error);
              } else {
                router.push('/checkIn');
              }
            }}
            className="flex flex-col gap-5"
          >
            <div>
              <Label htmlFor="email" className="ml-2">
                Email
              </Label>
              <Input type="email" name="email" placeholder="Enter your Email" />
            </div>
            <div>
              <Label htmlFor="password" className="ml-2">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your Password"
              />
            </div>
            <div className="flex justify-center">
              <SubmitButton
                text="Sign In"
                loadingText="Signing In..."
                buttonVariant="default"
                loadingVariant="outline"
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
