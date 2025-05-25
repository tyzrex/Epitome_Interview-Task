import { DashboardNavbar } from '@/components/layout/dashboard-navbar';
import DashboardSidebar from '@/components/layout/dashboard-sidebar';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='min-h-screen'>
        <div className='flex'>
          <DashboardSidebar />
          <div className='flex flex-1 flex-col'>
            <DashboardNavbar />
            <main className='flex-1 p-6'>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
