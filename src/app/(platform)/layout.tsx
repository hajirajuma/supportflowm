import { PlatformLayout } from '@/components/layouts/PlatformLayout'

export default function PlatformRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PlatformLayout>{children}</PlatformLayout>
}