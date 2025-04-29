// src/app/(DashboardLayout)/companies/[id]/tabs/ContactsTab.tsx
'use client'
import { Box, Typography } from '@mui/material'
import type { Company } from '@/types/company'

interface Props { company: Company }

export default function ContactsTab({ company }: Props) {
  return (
    <Box>
      <Typography variant="h6">Контакты компании</Typography>
      {/* company.contacts — массив контактов */}
      {company.contacts?.map(c => (
        <Box key={c.id} sx={{ mb: 1 }}>
          <Typography>{c.name} — {c.phone}</Typography>
        </Box>
      ))}
    </Box>
  )
}
