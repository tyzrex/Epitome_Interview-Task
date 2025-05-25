import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { STATUS_COLORS } from '@/modules/students';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for real-time updates

async function DashboardStats() {
  const statuses = [
    'Approved',
    'Pending',
    'Rejected',
    'Interview Scheduled',
    'Documents Required',
    'Under Review',
  ] as const;

  const counts = await Promise.all([
    prisma.student.count(),
    ...statuses.map((status) => prisma.student.count({ where: { status } })),
  ]);

  const [total, approved, pending, rejected, interview, documents, review] =
    counts;

  const stats = {
    total,
    approved,
    pending,
    rejected,
    interview,
    documents,
    review,
  };

  const statusCards = [
    {
      title: 'Total Students',
      value: stats.total,
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {statusCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900'>
                {card.value.toLocaleString()}
              </div>
              <p className='mt-1 text-xs text-gray-500'>
                {((card.value / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-teal-600' />
              Application Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  Interview Scheduled
                </span>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className={STATUS_COLORS['Interview Scheduled']}
                  >
                    {stats.interview}
                  </Badge>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  Documents Required
                </span>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className={STATUS_COLORS['Documents Required']}
                  >
                    {stats.documents}
                  </Badge>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Under Review</span>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className={STATUS_COLORS['Under Review']}
                  >
                    {stats.review}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            <Link href='/dashboard/students'>
              <Button className='bg-teal-600 hover:bg-teal-700'>
                View All Students
              </Button>
            </Link>
            <Link href='/dashboard/virtual'>
              <Button variant='outline'>Virtual Table Demo</Button>
            </Link>
            <Link href='/dashboard/server'>
              <Button variant='outline'>Server-side Rendering</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='space-y-2'>
              <div className='h-4 animate-pulse rounded bg-gray-200' />
              <div className='h-8 animate-pulse rounded bg-gray-200' />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>Dashboard</h1>
        <p className='mt-1 text-gray-600'>
          Overview of student applications and system metrics
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
