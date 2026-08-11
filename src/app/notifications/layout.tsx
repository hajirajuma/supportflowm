import { AdminLayout } from '@/components/layouts/AdminLayout'

export default function NotificationsRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
