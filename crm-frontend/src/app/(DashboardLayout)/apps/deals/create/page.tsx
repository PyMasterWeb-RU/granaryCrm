'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel'
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect'
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
import ParentCard from '@/app/components/shared/ParentCard'
import axiosWithAuth from '@/lib/axiosWithAuth'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	FormControlLabel,
	Grid,
	MenuItem,
	Radio,
	RadioGroup,
	SelectChangeEvent,
	Slider,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

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
	const [stage, setStage] = useState('Создана')
	const [probability, setProbability] = useState<number>(0)
	const [closeDate, setCloseDate] = useState<Date | null>(null)
	const [currencyDate, setCurrencyDate] = useState<Date | null>(null)
	const [dealType, setDealType] = useState<string>('')
	const [nomenclature, setNomenclature] = useState<string>('')
	const [packaging, setPackaging] = useState<string>('')
	const [deliveryType, setDeliveryType] = useState<string>('')
	const [transport, setTransport] = useState<string>('')
	const [currency, setCurrency] = useState<string>('')
	const [price, setPrice] = useState<number | ''>('')
	const [cbRate, setCbRate] = useState<number | null>(null)
	const [totalCost, setTotalCost] = useState<number | null>(null)
	const [accountId, setAccountId] = useState<string>('')
	const [contactId, setContactId] = useState<string>('')

	// Опции
	const dealTypes = ['Закупка', 'Реализация']
	const packagingOptions = ['Мешки', 'Биг-бэги', 'Контейнеры', 'Наливом']
	const deliveryTypes = [
		'Первый вариант',
		'Второй вариант',
		'Третий вариант',
		'Четвертый вариант',
		'Пятый вариант',
	]
	const transportOptionsMap: Record<string, string[]> = {
		'Первый вариант': ['Авто', 'ЖД'],
		'Второй вариант': ['Авто', 'ЖД', 'Морской'],
		'Третий вариант': ['Авто', 'Авиа'],
		'Четвертый вариант': ['ЖД', 'Морской'],
		'Пятый вариант': ['Авто', 'ЖД', 'Морской', 'Авиа'],
	}
	const currencies = ['RUB', 'USD', 'EUR', 'CNY']

	// Получение курса ЦБ через сервер
	const fetchCBRate = useCallback(async () => {
		if (currency === 'RUB') {
			setCbRate(1)
			setTotalCost(price !== '' ? Number(price) : null)
			setError(null)
			return
		}
		if (!currencyDate || !currency || price === '') {
			setCbRate(null)
			setTotalCost(null)
			setError(null)
			return
		}
		try {
			const today = new Date()
			today.setHours(0, 0, 0, 0)
			if (currencyDate > today) {
				setError('Дата курса не может быть в будущем')
				setCbRate(null)
				setTotalCost(null)
				return
			}

			// отправляем только YYYY-MM-DD
			const isoDate = currencyDate.toISOString().slice(0, 10)
			console.log('Запрос /deals/cb-rate', { currency, date: isoDate })

			const response = await axiosWithAuth.get('/deals/cb-rate', {
				params: {
					date: isoDate,
					currency,
				},
			})
			const rate = response.data.rate
			if (rate == null) {
				throw new Error(
					`Курс для ${currency} не найден на ${currencyDate.toLocaleDateString(
						'ru-RU'
					)}`
				)
			}
			setCbRate(rate)
			setTotalCost(Number(price) * rate)
			setError(null)
		} catch (err: any) {
			console.error('Ошибка при получении курса ЦБ:', err)
			setCbRate(null)
			setTotalCost(null)
			setError(
				`Не удалось получить курс для ${currency} на ${currencyDate.toLocaleDateString(
					'ru-RU'
				)}. ${err.message}`
			)
		}
	}, [currencyDate, currency, price])

	useEffect(() => {
		fetchCBRate()
	}, [fetchCBRate])

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		if (!title || !amount || !closeDate) {
			setError('Заполните обязательные поля: Название, Сумма, Дата закрытия')
			return
		}
		try {
			console.log('Отправка POST /deals:', {
				title,
				closeDate,
				currency,
				deliveryType,
			})
			await axiosWithAuth.post('/deals', {
				title,
				amount: Number(amount),
				stage,
				probability,
				closeDate,
				dealType,
				product: nomenclature,
				packaging,
				deliveryType, // Отправляем как строку
				transport,
				currency,
				price: Number(price),
				cbRate: cbRate,
				accountId: accountId || undefined,
				contactId: contactId || undefined,
			})
			router.push('/apps/deals')
		} catch (err: any) {
			console.error('Ошибка при создании сделки:', err)
			setError('Ошибка при создании сделки: ' + err.message)
		}
	}

	if (loading) {
		return (
			<PageContainer title='Новая сделка' description='Загрузка…'>
				<Box sx={{ textAlign: 'center', py: 6 }}>
					<CircularProgress />
				</Box>
			</PageContainer>
		)
	}

	return (
		<PageContainer
			title='Новая сделка'
			description='Заполните форму для создания сделки'
		>
			<Breadcrumb title='Сделки' subtitle='Создание' />
			<ParentCard title='Создать сделку'>
				<Box component='form' onSubmit={handleSubmit} sx={{ p: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Grid container spacing={3}>
						{/* Название */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-title'>Название</CustomFormLabel>
							<CustomTextField
								id='deal-title'
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
							<CustomFormLabel htmlFor='deal-amount'>Сумма</CustomFormLabel>
							<CustomTextField
								id='deal-amount'
								type='number'
								value={amount}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setAmount(e.target.value === '' ? '' : Number(e.target.value))
								}
								fullWidth
								required
							/>
						</Grid>

						{/* Тип сделки */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel>Тип сделки</CustomFormLabel>
							<RadioGroup
								row
								value={dealType}
								onChange={(_, v) => setDealType(v)}
							>
								{dealTypes.map(dt => (
									<FormControlLabel
										key={dt}
										value={dt}
										control={<Radio />}
										label={dt}
									/>
								))}
							</RadioGroup>
						</Grid>

						{/* Номенклатура */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-nomenclature'>
								Номенклатура
							</CustomFormLabel>
							<CustomTextField
								id='deal-nomenclature'
								value={nomenclature}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setNomenclature(e.target.value)
								}
								fullWidth
							/>
						</Grid>

						{/* Фасовка */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-packaging'>
								Фасовка
							</CustomFormLabel>
							<CustomSelect
								id='deal-packaging'
								value={packaging}
								onChange={(e: SelectChangeEvent<string>) =>
									setPackaging(e.target.value)
								}
								fullWidth
							>
								<MenuItem value=''>—</MenuItem>
								{packagingOptions.map(opt => (
									<MenuItem key={opt} value={opt}>
										{opt}
									</MenuItem>
								))}
							</CustomSelect>
						</Grid>

						{/* Вид доставки */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-delivery'>
								Вид доставки
							</CustomFormLabel>
							<CustomSelect
								id='deal-delivery'
								value={deliveryType}
								onChange={(e: SelectChangeEvent<string>) => {
									setDeliveryType(e.target.value)
									setTransport('')
								}}
								fullWidth
							>
								<MenuItem value=''>—</MenuItem>
								{deliveryTypes.map(opt => (
									<MenuItem key={opt} value={opt}>
										{opt}
									</MenuItem>
								))}
							</CustomSelect>
						</Grid>

						{/* Транспорт */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-transport'>
								Транспорт
							</CustomFormLabel>
							<CustomSelect
								id='deal-transport'
								value={transport}
								onChange={(e: SelectChangeEvent<string>) =>
									setTransport(e.target.value)
								}
								disabled={!deliveryType}
								fullWidth
							>
								<MenuItem value=''>—</MenuItem>
								{deliveryType &&
									transportOptionsMap[deliveryType]?.map(opt => (
										<MenuItem key={opt} value={opt}>
											{opt}
										</MenuItem>
									))}
							</CustomSelect>
						</Grid>

						{/* Валюта */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-currency'>Валюта</CustomFormLabel>
							<CustomSelect
								id='deal-currency'
								value={currency}
								onChange={(e: SelectChangeEvent<string>) =>
									setCurrency(e.target.value)
								}
								fullWidth
							>
								<MenuItem value=''>—</MenuItem>
								{currencies.map(c => (
									<MenuItem key={c} value={c}>
										{c}
									</MenuItem>
								))}
							</CustomSelect>
						</Grid>

						{/* Цена */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-price'>Цена</CustomFormLabel>
							<CustomTextField
								id='deal-price'
								type='number'
								value={price}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setPrice(e.target.value === '' ? '' : Number(e.target.value))
								}
								fullWidth
							/>
						</Grid>

						{/* Дата курса */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<CustomFormLabel htmlFor='deal-currency-date'>
									Дата курса
								</CustomFormLabel>
								<DatePicker
									value={currencyDate}
									onChange={date => setCurrencyDate(date)}
									maxDate={new Date()}
									renderInput={params => (
										<CustomTextField {...params} fullWidth />
									)}
								/>
							</LocalizationProvider>
						</Grid>

						{/* Курс ЦБ */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-cb-rate'>Курс ЦБ</CustomFormLabel>
							<CustomTextField
								id='deal-cb-rate'
								value={cbRate != null ? cbRate.toFixed(4) : '—'}
								fullWidth
								disabled
							/>
						</Grid>

						{/* Итоговая стоимость */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-total'>
								Итоговая стоимость (RUB)
							</CustomFormLabel>
							<CustomTextField
								id='deal-total'
								value={totalCost != null ? totalCost.toFixed(2) : '—'}
								fullWidth
								disabled
							/>
						</Grid>

						{/* Этап */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<CustomFormLabel htmlFor='deal-stage'>Этап</CustomFormLabel>
							<CustomSelect
								id='deal-stage'
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
								valueLabelDisplay='auto'
							/>
						</Grid>

						{/* Дата закрытия */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<CustomFormLabel htmlFor='deal-close-date'>
									Дата закрытия
								</CustomFormLabel>
								<DatePicker
									value={closeDate}
									onChange={date => setCloseDate(date)}
									renderInput={params => (
										<CustomTextField {...params} fullWidth required />
									)}
								/>
							</LocalizationProvider>
						</Grid>

						{/* Клиент */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-account'>Клиент</CustomFormLabel>
							<CustomSelect
								id='deal-account'
								value={accountId}
								onChange={(e: SelectChangeEvent<string>) =>
									setAccountId(e.target.value)
								}
								fullWidth
							>
								<MenuItem value=''>—</MenuItem>
								{accounts.map(a => (
									<MenuItem key={a.id} value={a.id}>
										{a.name}
									</MenuItem>
								))}
							</CustomSelect>
						</Grid>

						{/* Контакт */}
						<Grid size={{ xs: 12, sm: 6 }}>
							<CustomFormLabel htmlFor='deal-contact'>Контакт</CustomFormLabel>
							<CustomSelect
								id='deal-contact'
								value={contactId}
								onChange={(e: SelectChangeEvent<string>) =>
									setContactId(e.target.value)
								}
								fullWidth
							>
								<MenuItem value=''>—</MenuItem>
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
								<Button variant='contained' color='primary' type='submit'>
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
