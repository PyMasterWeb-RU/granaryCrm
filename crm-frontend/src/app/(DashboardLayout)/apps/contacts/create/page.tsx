'use client'

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from 'react'
import { useRouter } from 'next/navigation'
import PageContainer from '@/app/components/container/PageContainer'
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import ParentCard from '@/app/components/shared/ParentCard'
import {
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import axiosWithAuth from '@/lib/axiosWithAuth'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'

interface Company {
  id: string
  name: string
}

export default function CreateContactPage() {
  const router = useRouter()

  // справочники
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // поля формы
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [accountId, setAccountId] = useState('')

  useEffect(() => {
    axiosWithAuth
      .get<Company[]>('/accounts')
      .then(res => setCompanies(res.data))
      .catch(() => setError('Не удалось загрузить список компаний'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await axiosWithAuth.post('/contacts', {
        firstName,
        lastName,
        email: email || undefined,
        phone: phone || undefined,
        position: position || undefined,
        accountId: accountId || undefined,
      })
      router.push('/apps/contacts')
    } catch {
      setError('Ошибка при создании контакта')
    }
  }

  // явные типы для onChange
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value)
  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value)
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value)
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPhone(e.target.value)
  const handlePositionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPosition(e.target.value)
  const handleCompanyChange = (e: SelectChangeEvent<string>) =>
    setAccountId(e.target.value)

  if (loading) {
    return (
      <PageContainer title="Новый контакт" description="Загрузка…">
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Новый контакт"
      description="Заполните форму для создания контакта"
    >
      <Breadcrumb title="Контакты" subtitle="Создание" />
      <ParentCard title="Создать контакт">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 2 }}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="first-name">
                Имя
              </CustomFormLabel>
              <CustomTextField
                id="first-name"
                value={firstName}
                onChange={handleFirstNameChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="last-name">
                Фамилия
              </CustomFormLabel>
              <CustomTextField
                id="last-name"
                value={lastName}
                onChange={handleLastNameChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="contact-email">
                Email
              </CustomFormLabel>
              <CustomTextField
                id="contact-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="contact-phone">
                Телефон
              </CustomFormLabel>
              <CustomTextField
                id="contact-phone"
                value={phone}
                onChange={handlePhoneChange}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="contact-position">
                Должность
              </CustomFormLabel>
              <CustomTextField
                id="contact-position"
                value={position}
                onChange={handlePositionChange}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomFormLabel htmlFor="contact-company">
                Компания
              </CustomFormLabel>
              <CustomSelect
                id="contact-company"
                value={accountId}
                onChange={handleCompanyChange}
                fullWidth
              >
                <MenuItem value="">—</MenuItem>
                {companies.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

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
                  onClick={() => router.push('/apps/contacts')}
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
