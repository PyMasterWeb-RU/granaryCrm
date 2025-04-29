// src/app/(DashboardLayout)/companies/[id]/tabs/InfoTab.tsx
'use client'
import { Box, Typography } from '@mui/material'
import type { Company } from '@/types/company'

interface Props { company: Company }

export default function InfoTab({ company }: Props) {
  return (
    <Box>
      <Typography variant="h6">Реквизиты</Typography>
      <Typography>ИНН: {company.inn}</Typography>
      <Typography>КПП: {company.kpp}</Typography>
      <Typography>ОГРН: {company.ogrn}</Typography>
      {/* другие поля */}
      <Typography variant="h6" sx={{ mt: 2 }}>Обращения</Typography>
      {/* Здесь можно разместить компонент списка обращений */}
    </Box>
  )
}
