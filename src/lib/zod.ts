import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().length(10),
  amount: z.number().int().nonnegative(),
  partIndex: z.number().nonnegative(),
  rowIndex: z.number().nonnegative(),
  seatIndex: z.number().nonnegative(),
  seatStatus: z.enum(['AVAILABLE', 'PENDING', 'BOOKED']),
  paymentStatus: z.enum(['UNPAID', 'PAID']),
});

export const TableSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().length(10),
  amount: z.number().int().nonnegative(),
  seatNumber: z.string(),
  seatStatus: z.enum(['AVAILABLE', 'PENDING', 'BOOKED']),
  paymentStatus: z.enum(['UNPAID', 'PAID']),
});

export type Table = z.infer<typeof TableSchema>;
