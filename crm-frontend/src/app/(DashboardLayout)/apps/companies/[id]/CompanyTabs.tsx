'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import axiosWithAuth from '@/lib/axiosWithAuth'
import type { Company, Contact } from '@/types/company'

interface Deal {
  id: string
  title: string
  amount: number
  stage: string
  probability: number
  closeDate: string
}

interface CompanyTabsProps {
  initialCompany: Company
}

export default function CompanyTabs({ initialCompany }: CompanyTabsProps) {
  const [tab, setTab] = useState<'info' | 'contacts' | 'documents' | 'deals' | 'files'>('info')
  const handleChange = (_: React.SyntheticEvent, newValue: typeof tab) => {
    setTab(newValue)
  }

  const router = useRouter()

  // --- состояние сделок по компании ---
  const [deals, setDeals] = useState<Deal[]>([])
  const [loadingDeals, setLoadingDeals] = useState(true)
  const [errorDeals, setErrorDeals] = useState<string | null>(null)

  useEffect(() => {
    if (tab !== 'deals') return

    setLoadingDeals(true)
    axiosWithAuth
      .get<Deal[]>(`/deals?accountId=${initialCompany.id}`)
      .then(res => {
        setDeals(res.data)
        setErrorDeals(null)
      })
      .catch(() => {
        setErrorDeals('Не удалось загрузить сделки')
      })
      .finally(() => {
        setLoadingDeals(false)
      })
  }, [tab, initialCompany.id])

   // --- контакты ---
   const [contacts, setContacts] = useState<Contact[]>([])
   const [loadingContacts, setLoadingContacts] = useState(true)
   const [errorContacts, setErrorContacts] = useState<string | null>(null)
 
   useEffect(() => {
     if (tab !== 'contacts') return
 
     setLoadingContacts(true)
     axiosWithAuth
       .get<Contact[]>(`/contacts?accountId=${initialCompany.id}`)
       .then(res => {
         // если у Contact нет поля `name`, собираем из firstName/lastName
         const formatted = res.data.map(c => ({
           id: c.id,
           name:
             'name' in c
               ? (c as any).name
               : `${(c as any).firstName} ${(c as any).lastName}`,
           email: c.email,
           phone: c.phone,
         }))
         setContacts(formatted)
         setErrorContacts(null)
       })
       .catch(() => {
         setErrorContacts('Не удалось загрузить контакты')
       })
       .finally(() => {
         setLoadingContacts(false)
       })
   }, [tab, initialCompany.id])

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={handleChange}
        aria-label="Company tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="Информация" value="info" />
        <Tab label="Контакты" value="contacts" />
        <Tab label="Документы" value="documents" />
        <Tab label="Сделки" value="deals" />
        <Tab label="Файлы" value="files" />
      </Tabs>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
        {tab === 'info' && (
          <Grid container spacing={4}>
            {/* Основная информация */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Основная информация
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Название
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {initialCompany.name}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Отрасль
                </Typography>
                <Typography variant="body1">
                  {initialCompany.industry || '—'}
                </Typography>
              </Box>
            </Grid>

            {/* Юридические данные */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Юридические данные
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  ИНН
                </Typography>
                <Typography variant="body1">
                  {initialCompany.inn || '—'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  КПП
                </Typography>
                <Typography variant="body1">
                  {initialCompany.kpp || '—'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  ОГРН
                </Typography>
                <Typography variant="body1">
                  {initialCompany.ogrn || '—'}
                </Typography>
              </Box>
            </Grid>

            {/* Контакты и адрес */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Контакты и адрес
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Адрес
                </Typography>
                <Typography variant="body1">
                  {initialCompany.address || '—'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Сайт
                </Typography>
                <Typography variant="body1">
                  {initialCompany.website || '—'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {initialCompany.email || '—'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Телефон
                </Typography>
                <Typography variant="body1">
                  {initialCompany.phone || '—'}
                </Typography>
              </Box>
            </Grid>

            {/* Владелец и дата */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Дополнительно
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Владелец
                </Typography>
                <Typography variant="body1">
                  {initialCompany.owner?.email || '—'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Создано
                </Typography>
                <Typography variant="body1">
                  {new Date(initialCompany.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {tab === 'contacts' && (
          <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Контакты компании</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                router.push(
                  `/apps/contacts/create?accountId=${initialCompany.id}`
                )
              }
            >
              Добавить контакт
            </Button>
          </Box>

          {loadingContacts && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {errorContacts && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorContacts}
            </Alert>
          )}

          {!loadingContacts && !errorContacts && (
            <>
              {contacts.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: 2, boxShadow: 1 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Имя</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Email</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Телефон</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contacts.map(c => (
                        <TableRow
                          key={c.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            router.push(`/apps/contacts/${c.id}`)
                          }
                        >
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.email || '—'}</TableCell>
                          <TableCell>{c.phone || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>Контактов не добавлено</Typography>
              )}
            </>
          )}
        </Box>
      )}

        {tab === 'documents' && (
          <Typography>Здесь будут документы компании</Typography>
        )}

        {tab === 'deals' && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Сделки компании</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  router.push(`/apps/deals/create?accountId=${initialCompany.id}`)
                }
              >
                Новая сделка
              </Button>
            </Box>

            {loadingDeals && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {errorDeals && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorDeals}
              </Alert>
            )}

            {!loadingDeals && !errorDeals && (
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, boxShadow: 1 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Название</strong></TableCell>
                      <TableCell><strong>Сумма</strong></TableCell>
                      <TableCell><strong>Этап</strong></TableCell>
                      <TableCell><strong>Вероятность</strong></TableCell>
                      <TableCell><strong>Закрытие</strong></TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {tab === 'files' && (
          <Typography>Здесь будут файлы и вложения компании</Typography>
        )}
      </Paper>
    </Box>
  )
}
