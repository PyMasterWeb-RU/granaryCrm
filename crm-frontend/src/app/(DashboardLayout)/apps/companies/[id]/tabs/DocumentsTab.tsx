// src/app/(DashboardLayout)/companies/[id]/tabs/DocumentsTab.tsx
'use client'
import { useEffect, useState } from 'react'
import { Box, List, ListItem, Typography } from '@mui/material'

interface Props { companyId: string }

export default function DocumentsTab({ companyId }: Props) {
  const [docs, setDocs] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/companies/${companyId}/documents`)
      .then(r => r.json())
      .then(setDocs)
  }, [companyId])

  return (
    <Box>
      <Typography variant="h6">Документы</Typography>
      <List>
        {docs.map((d, i) => (
          <ListItem key={i}>
            <a href={d.url} target="_blank" rel="noreferrer">{d.name}</a>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
