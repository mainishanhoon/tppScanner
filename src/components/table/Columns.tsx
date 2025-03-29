'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/lib/zod';
import { DataTableColumnHeader } from './ColumnHeader';
import { DataTableRowActions } from './RowActions';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Table>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader className="sr-only" column={column} title="ID" />
    ),
    cell: ({ row }) => {
      return <span className="sr-only">{row.getValue('id')}</span>;
    },
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="border-r-2 border-dashed text-center"
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="border-r-2 text-center font-medium capitalize">
          <span>{row.getValue('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="border-r-2 border-dashed text-center"
        column={column}
        title="Phone Number"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="border-r-2 text-center font-medium">
          <span>{row.getValue('phoneNumber')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'seatNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="border-r-2 border-dashed text-center"
        column={column}
        title="Seat Number"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="border-r-2 text-center">
          <span>
            <Badge className="rounded-sm font-medium uppercase">
              {row.getValue('seatNumber')}
            </Badge>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'seatStatus',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="border-r-2 border-dashed text-center"
        column={column}
        title="Seat Status"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="border-r-2 text-center">
          <span>
            <Badge
              variant={
                row.getValue('seatStatus') === 'BOOKED'
                  ? 'constructive'
                  : 'pending'
              }
              className="rounded-sm font-medium uppercase"
            >
              {row.getValue('seatStatus')}
            </Badge>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'checkInDay2',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="border-r-2 border-dashed text-center"
        column={column}
        title="CheckIn Status"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="border-r-2 text-center">
          <span>
            <Badge
              variant={
                !!row.getValue('checkInDay2') ? 'constructive' : 'destructive'
              }
              className="rounded-md font-medium uppercase"
            >
              {!!row.getValue('checkInDay2') ? 'TRUE' : 'FALSE'}
            </Badge>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'bookedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="border-r-2 border-dashed text-center"
        column={column}
        title="Booked On"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="border-r-2 text-center font-medium">
          <span>
            {Intl.DateTimeFormat('en-IN', {
              dateStyle: 'medium',
            }).format(row.getValue('bookedAt'))}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    accessorKey: 'checkInDay2At',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="border-r-2 border-dashed text-center"
        column={column}
        title="CheckedIn At"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="border-r-2 text-center font-medium">
          <span>
            {Intl.DateTimeFormat('en-IN', {
              timeStyle: 'medium',
            })
              .format(row.getValue('checkInDay2At'))
              .toUpperCase()}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
