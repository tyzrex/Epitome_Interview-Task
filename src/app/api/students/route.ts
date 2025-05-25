// app/students/api/route.ts

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status') || undefined;
  const name = searchParams.get('name') || undefined;
  const program = searchParams.get('program') || undefined;

  const where = {
    ...(status && {
      status: { contains: status, mode: 'insensitive' as const },
    }),
    ...(name && { name: { contains: name, mode: 'insensitive' as const } }),
    ...(program && {
      program: { contains: program, mode: 'insensitive' as const },
    }),
  };

  const [students, total] = await Promise.all([
    db.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { applicationDate: 'desc' },
    }),
    db.student.count({ where }),
  ]);

  return NextResponse.json({
    data: students,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
