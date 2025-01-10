'use client'

import { Suspense } from 'react'
import DashboardContent from './dashboard-content'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}