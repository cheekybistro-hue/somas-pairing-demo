import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AdminAccessGate } from '@/lib/auth/admin-access'

export const Route = createFileRoute('/dev')({
  component: DevAdminRoute,
})

function DevAdminRoute() {
  return (
    <AdminAccessGate>
      <Outlet />
    </AdminAccessGate>
  )
}
