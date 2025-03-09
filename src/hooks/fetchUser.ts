import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function getUser() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return session;
}
