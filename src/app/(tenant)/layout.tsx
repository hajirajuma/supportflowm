import { TenantLayout } from '@/components/layouts/TenantLayout'

export default function TenantRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TenantLayout>{children}</TenantLayout>
}