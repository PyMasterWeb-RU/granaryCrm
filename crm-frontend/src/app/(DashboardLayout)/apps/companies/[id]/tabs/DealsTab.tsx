// src/app/(DashboardLayout)/companies/[id]/tabs/DealsTab.tsx
'use client'
import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'

interface Props { companyId: string }

export default function DealsTab({ companyId }: Props) {
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/companies/${companyId}/deals`)
      .then(r => r.json())
      .then(setDeals)
  }, [companyId])

  return (
    <Box>
      <Typography variant="h6">Сделки</Typography>
      {deals.map(deal => (
        <Box key={deal.id} sx={{ mb: 1 }}>
          <Typography>#{deal.id} — {deal.title} ({deal.amount}₽)</Typography>
        </Box>
      ))}
    </Box>
  )
}
