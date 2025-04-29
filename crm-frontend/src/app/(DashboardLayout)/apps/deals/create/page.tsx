// src/app/(DashboardLayout)/apps/deals/create/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageContainer from '@/app/components/container/PageContainer'
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import ParentCard from '@/app/components/shared/ParentCard'
import {
  Box,
  Grid,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Slider,
  SelectChangeEvent,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import axiosWithAuth from '@/lib/axiosWithAuth'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect'

interface Account {
  id: string
  name: string
}
interface Contact {
  id: string
  firstName: string
  lastName: string
}

export default function CreateDealPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // form state
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [stage, setStage] = useState('New')
  const [probability, setProbability] = useState<number>(0)
  const [closeDate, setCloseDate] = useState<Date | null>(null)
  const [accountId, setAccountId] = useState<string>('')
  const [contactId, setContactId] = useState<string>('')

  useEffect(() => {
    Promise.all([
      axiosWithAuth.get<Account[]>('/accounts'),
      axiosWithAuth.get<Contact[]>('/contacts'),
    ])
      .then(([a, c]) => {
        setAccounts(a.data)
        setContacts(c.data)
      })
      .catch(() => setError('Не удалось загрузить справочники'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await axiosWithAuth.post('/deals', {
        title,
        amount: Number(amount),
        stage,
        probability,
        closeDate,
        accountId: accountId || undefined,
        contactId: contactId || undefined,
      })
      router.push('/apps/deals')
    } catch {
      setError('Ошибка при создании сделки')
    }
  }

  if (loading) {
    return (
      <PageContainer title="Новая сделка" description="Загрузка…">
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Новая сделка" description="Заполните форму для создания сделки">
      <Breadcrumb title="Сделки" subtitle="Создание" />
      <ParentCard title="Создать сделку">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 2 }}
        >
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Grid container spacing={3}>
            {/* Название */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="deal-title">Название</CustomFormLabel>
              <CustomTextField
                id="deal-title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                fullWidth
                required
              />
            </Grid>

            {/* Сумма */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="deal-amount">Сумма</CustomFormLabel>
              <CustomTextField
                id="deal-amount"
                type="number"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value === '' ? '' : Number(e.target.value))
                }
                fullWidth
                required
              />
            </Grid>

            {/* Этап */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomFormLabel htmlFor="deal-stage">Этап</CustomFormLabel>
              <CustomSelect
                id="deal-stage"
                value={stage}
                onChange={(e: SelectChangeEvent<string>) =>
                  setStage(e.target.value)
                }
                fullWidth
              >
                {['Создана', 'В процессе', 'Завершена', 'Провалена'].map(s => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            {/* Вероятность */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomFormLabel>Вероятность: {probability}%</CustomFormLabel>
              <Slider
                value={probability}
                onChange={(_, v) => setProbability(v as number)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Дата закрытия */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CustomFormLabel htmlFor="deal-close-date">
                  Дата закрытия
                </CustomFormLabel>
                <DatePicker
                  value={closeDate}
                  onChange={date => setCloseDate(date)}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      fullWidth
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Клиент */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="deal-account">Клиент</CustomFormLabel>
              <CustomSelect
                id="deal-account"
                value={accountId}
                onChange={(e: SelectChangeEvent<string>) =>
                  setAccountId(e.target.value)
                }
                fullWidth
              >
                <MenuItem value="">—</MenuItem>
                {accounts.map(a => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            {/* Контакт */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="deal-contact">Контакт</CustomFormLabel>
              <CustomSelect
                id="deal-contact"
                value={contactId}
                onChange={(e: SelectChangeEvent<string>) =>
                  setContactId(e.target.value)
                }
                fullWidth
              >
                <MenuItem value="">—</MenuItem>
                {contacts.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            {/* Кнопки */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Создать
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => router.push('/apps/deals')}
                >
                  Отмена
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ParentCard>
    </PageContainer>
  )
}
