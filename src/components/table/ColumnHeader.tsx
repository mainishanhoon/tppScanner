import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeClosed } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn('text-center font-bold tracking-wider', className)}>
        {title}
      </div>
    );
  }

  return (
    <div className={cn('text-center tracking-wide', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 data-[state=open]:bg-accent"
          >
            <span className="font-bold">{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown strokeWidth={3} className="size-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp strokeWidth={3} className="size-4" />
            ) : (
              <ChevronsUpDown strokeWidth={3} className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp
              strokeWidth={3}
              className="size-3.5 text-muted-foreground/70"
            />
            <span>Asc</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown
              strokeWidth={3}
              className="size-3.5 text-muted-foreground/70"
            />
            <span>Desc</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeClosed
              strokeWidth={3}
              className="size-3.5 text-muted-foreground/70"
            />
            <span>Hide</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
