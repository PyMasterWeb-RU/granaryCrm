// src/app/(DashboardLayout)/apps/contacts/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageContainer from '@/app/components/container/PageContainer'
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import ParentCard from '@/app/components/shared/ParentCard'
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'
import axiosWithAuth from '@/lib/axiosWithAuth'

// Локальный тип для контакта
type ApiContact = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  account?: { id: string; name: string }
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ApiContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axiosWithAuth
      .get<ApiContact[]>('/contacts')
      .then(res => setContacts(res.data))
      .catch(() => setError('Не удалось загрузить список контактов'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageContainer title="Контакты" description="Список всех контактов">
      <Breadcrumb title="Контакты" subtitle="Все контакты" />

      {/* ParentCard теперь получает один фрагмент, в котором всё */}
      <ParentCard title="Все контакты">
        <>
          {/* Кнопка «Добавить контакт» */}
          <Box mb={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/apps/contacts/create')}
            >
              Добавить контакт
            </Button>
          </Box>

          {/* Содержимое таблицы */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : contacts.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Имя</strong></TableCell>
                    <TableCell><strong>Компания</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Телефон</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map(c => (
                    <TableRow
                      key={c.id}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell>{c.firstName} {c.lastName}</TableCell>
                      <TableCell>{c.account?.name || '—'}</TableCell>
                      <TableCell>{c.email || '—'}</TableCell>
                      <TableCell>{c.phone || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Контактов не найдено</Typography>
          )}
        </>
      </ParentCard>
    </PageContainer>
  )
}
