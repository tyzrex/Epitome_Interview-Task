'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Zap,
  Server,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Students', href: '/dashboard/students', icon: Users },
  { name: 'Virtual Table', href: '/dashboard/virtual', icon: Zap },
  { name: 'Server SSR', href: '/dashboard/server', icon: Server },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 1250px)');

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(false);
    }
  }, [isMobile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        if (isMobile) {
          setMobileOpen(!mobileOpen);
        } else {
          setCollapsed(!collapsed);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, mobileOpen, isMobile]);

  const SidebarContent = () => (
    <div className='fixed left-0 flex h-screen w-full max-w-64 flex-col justify-between'>
      <div className='p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600'>
            <GraduationCap className='h-5 w-5 text-white' />
          </div>
          {(!collapsed || isMobile) && (
            <div>
              <h1 className='text-lg font-semibold text-gray-900'>
                StudyAbroad
              </h1>
              <p className='text-xs text-gray-500'>CRM</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4'>
        <ul className='space-y-2'>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'border border-teal-200 bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',

                    collapsed && !isMobile ? 'justify-center' : 'justify-start',
                  )}
                  title={collapsed && !isMobile ? item.name : undefined}
                >
                  <item.icon className='h-5 w-5 flex-shrink-0' />
                  {(!collapsed || isMobile) && <span>{item.name}</span>}
                  {collapsed && !isMobile && (
                    <div className='pointer-events-none absolute left-full z-50 ml-2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100'>
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle - Desktop only */}
      {!isMobile && (
        <div className='border-t border-gray-200 p-4'>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className='flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-50'
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className='h-5 w-5 text-gray-500' />
            ) : (
              <ChevronLeft className='h-5 w-5 text-gray-500' />
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setMobileOpen(true)}
          className='fixed top-4 left-4 z-50 bg-white shadow-md md:hidden'
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div className='fixed inset-0 z-50 md:hidden'>
            <div
              className='fixed inset-0 bg-black/50'
              onClick={() => setMobileOpen(false)}
            />
            <div className='fixed top-0 left-0 flex h-full w-64 flex-col bg-white shadow-xl'>
              <div className='flex items-center justify-between border-b p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600'>
                    <GraduationCap className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <h1 className='text-lg font-semibold text-gray-900'>
                      StudyAbroad
                    </h1>
                    <p className='text-xs text-gray-500'>CRM</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setMobileOpen(false)}
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>
              <nav className='flex-1 p-4'>
                <ul className='space-y-2'>
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' &&
                        pathname.startsWith(item.href));
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'border border-teal-200 bg-teal-50 text-teal-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          )}
                        >
                          <item.icon className='h-5 w-5 flex-shrink-0' />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'min-w-64',
      )}
    >
      <SidebarContent />
    </div>
  );
}
