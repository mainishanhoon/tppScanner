'use client';

import { RefreshCcw } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './FacetedFilter';
import { DataTableViewOptions } from './ViewOptions';
import { seatStatus } from '@/constants/sort';
import { useState } from 'react';
import { CalendarDatePicker } from './CalendarDatePicker';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
    table.getColumn('bookedAt')?.setFilterValue([from, to]);
  };
  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('name')?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] font-semibold lg:w-[250px]"
        />
        {table.getColumn('seatStatus') && (
          <DataTableFacetedFilter
            column={table.getColumn('seatStatus')}
            title="Seat Status"
            options={seatStatus}
          />
        )}
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="border-input bg-background hover:bg-muted-foreground/30 h-8 px-2 lg:px-3"
          >
            Reset
            <RefreshCcw strokeWidth={2.5} className="size-4" />
          </Button>
        )}

        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="border-input h-8 w-[250px] border-dashed"
          variant="outline"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
