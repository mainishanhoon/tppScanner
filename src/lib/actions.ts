'use server';

import { signIn } from '@/lib/auth';

export async function Authenticate(formData: FormData) {
  try {
    await signIn('credentials', {
      email: String(formData.get('email')),
      password: formData.get('password') as string,
      redirect: false,
    });
  } catch (error) {
    console.error('Sign-in Error ::', error);
    return { error: 'Invalid Email or Password' };
  }
}
