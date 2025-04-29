// src/app/(DashboardLayout)/companies/[id]/tabs/FilesTab.tsx
'use client'
import { useEffect, useState } from 'react'
import { Box, List, ListItem, Typography } from '@mui/material'

interface Props { companyId: string }

export default function FilesTab({ companyId }: Props) {
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/companies/${companyId}/files`)
      .then(r => r.json())
      .then(setFiles)
  }, [companyId])

  return (
    <Box>
      <Typography variant="h6">Файлы</Typography>
      <List>
        {files.map(f => (
          <ListItem key={f.id}>
            <a href={f.url} target="_blank" rel="noreferrer">{f.filename}</a>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
