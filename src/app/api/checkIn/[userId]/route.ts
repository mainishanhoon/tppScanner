import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ userId: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  const { userId } = await params;

  try {
    const user = await prisma.tpp_2.findFirstOrThrow({
      where: { id: userId, seatStatus: 'BOOKED' },
      select: {
        id: true,
        name: true,
        seatNumber: true,
        checkInDay1: true,
        checkInDay1At: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error Fetching User:', error);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}

export async function POST(_: NextRequest, { params }: Params) {
  const { userId } = await params;

  try {
    const user = await prisma.tpp_2.findFirstOrThrow({
      where: { id: userId, seatStatus: 'BOOKED' },
      select: { checkInDay1: true, checkInDay1At: true },
    });

    if (user.checkInDay1) {
      return NextResponse.json({
        message: 'User Already Checked In',
        checkInTime: user.checkInDay1At,
        status: 400,
      });
    }
  } catch (error) {
    console.error('Error Updating User:', error);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updateInfo = await prisma.tpp_2.update({
    where: { id: userId },
    data: { checkInDay1: true, checkInDay1At: new Date() },
  });

  return NextResponse.json({
    message: 'Check-In Successful',
    checkInTime: updateInfo.checkInDay1At,
  });
}
