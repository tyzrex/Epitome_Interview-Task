import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  console.log('Updating student:', { id, status });
  if (!id || !status) {
    return new NextResponse('Invalid request', { status: 400 });
  }

  try {
    const updatedStudent = await db.student.update({
      where: { id },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error: unknown) {
    console.error('Update failed:', error);
    return new NextResponse('Failed to update student', { status: 500 });
  }
}
