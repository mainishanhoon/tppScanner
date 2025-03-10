import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ userId: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  try {
    const user = await prisma.tpp_2.findUnique({
      where: { id: userId, seatStatus: 'BOOKED' },
      select: {
        id: true,
        name: true,
        seatNumber: true,
        checkInDay1: true,
        checkInDay1At: true,
      },
    });

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { userId } = await params;
  try {
    const user = await prisma.tpp_2.findUnique({
      where: { id: userId, seatStatus: 'BOOKED' },
      select: { checkInDay1: true, checkInDay1At: true },
    });

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.checkInDay1) {
      return NextResponse.json({
        message: 'User Already Checked In',
        checkInTime: user.checkInDay1At,
        status: 400,
      });
    }

    const updateInfo = await prisma.tpp_2.update({
      where: { id: userId },
      data: { checkInDay1: true, checkInDay1At: new Date() },
    });

    return NextResponse.json({
      message: 'Check-In Successful',
      checkInTime: updateInfo.checkInDay1At,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
