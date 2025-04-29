// src/app/(DashboardLayout)/apps/deals/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageContainer from '@/app/components/container/PageContainer'
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import ParentCard from '@/app/components/shared/ParentCard'
import {
  Box,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
} from '@mui/material'
import axiosWithAuth from '@/lib/axiosWithAuth'

interface Deal {
  id: string
  title: string
  amount: number
  stage: string
  probability: number
  closeDate: string
  account?: { name: string }
  contact?: { firstName: string; lastName: string }
}

export default function DealsListPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axiosWithAuth
      .get<Deal[]>('/deals')
      .then(res => setDeals(res.data))
      .catch(() => setError('Не удалось загрузить список сделок'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageContainer title="Сделки" description="Список всех сделок">
      <Breadcrumb title="Сделки" subtitle="Список" />

      <ParentCard title="Все сделки">
        <Box sx={{ p: 2 }}>
          {/* кнопка создания сделки */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/apps/deals/create')}
            >
              Новая сделка
            </Button>
          </Box>

          {loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Сумма</TableCell>
                    <TableCell>Этап</TableCell>
                    <TableCell>Вероятность</TableCell>
                    <TableCell>Закрытие</TableCell>
                    <TableCell>Клиент</TableCell>
                    <TableCell>Контакт</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deals.map(deal => (
                    <TableRow
                      key={deal.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/apps/deals/${deal.id}`)}
                    >
                      <TableCell>{deal.title}</TableCell>
                      <TableCell>{deal.amount.toLocaleString()}</TableCell>
                      <TableCell>{deal.stage}</TableCell>
                      <TableCell>{deal.probability}%</TableCell>
                      <TableCell>
                        {new Date(deal.closeDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{deal.account?.name || '—'}</TableCell>
                      <TableCell>
                        {deal.contact
                          ? `${deal.contact.firstName} ${deal.contact.lastName}`
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </ParentCard>
    </PageContainer>
  )
}
