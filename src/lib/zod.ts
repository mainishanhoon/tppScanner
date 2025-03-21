import { z } from 'zod';

export const TableSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().length(10),
  amount: z.number().int().nonnegative(),
  seatNumber: z.string(),
  checkInDay1: z.boolean(),
  seatStatus: z.enum(['AVAILABLE', 'PENDING', 'BOOKED']),
});

export type Table = z.infer<typeof TableSchema>;
