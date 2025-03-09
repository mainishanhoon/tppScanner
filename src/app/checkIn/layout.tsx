import getUser from '@/hooks/fetchUser';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function CheckInRoute({ children }: { children: ReactNode }) {
  const session = await getUser();
  
  if (!session) {
    return redirect('/');
  }

  return <main className="p-2 md:p-3 lg:p-5">{children}</main>;
}
