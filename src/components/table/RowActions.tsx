'use client';

import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  async function CheckInUser() {
    toast.promise(
      fetch(`/api/checkIn/${row.getValue('id')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        router.refresh();
      }),
      {
        loading: 'Checking In...',
        success: 'Check-In Successful',
        error: "Couldn't Check-In",
      },
    );
  }

  return (
    <section className="flex justify-center" suppressHydrationWarning={true}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-muted hover:bg-muted-foreground/20 data-[state=open]:bg-muted-foreground/20 flex size-8 p-0"
          >
            <Ellipsis strokeWidth={3} size={20} />
            <p className="sr-only">Actions</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto" align="center">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={CheckInUser}>
              <LogIn strokeWidth={3} size={15} />
              <p className="font-medium">CheckIn User</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
