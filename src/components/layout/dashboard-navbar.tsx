'use client';

import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function DashboardNavbar() {
  return (
    <header className='border-b border-gray-200 bg-white px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Search */}
        <div className='max-w-md flex-1'>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='Search...'
              className='border-gray-200 bg-gray-50 pl-10'
            />
          </div>
        </div>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          {/* Notifications */}
          <Button variant='ghost' size='sm' className='relative'>
            <Bell className='h-5 w-5' />
            <Badge className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 p-0 text-xs text-white'>
              3
            </Badge>
          </Button>

          {/* User */}
          <div className='flex items-center gap-3'>
            <div className='text-right'>
              <p className='text-sm font-medium text-gray-900'>Borys J.</p>
              <p className='text-xs text-gray-500'>Admin</p>
            </div>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-600'>
              <User className='h-4 w-4 text-white' />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
