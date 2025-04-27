// src/app/[lang]/companies/create/page.tsx
'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import axiosWithAuth from '@/lib/axiosWithAuth'
import {
	Alert,
	Autocomplete,
	AutocompleteRenderInputParams,
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid' // Grid v2 из MUI v7
import { useParams, useRouter } from 'next/navigation'
import {
	ChangeEvent,
	FormEvent,
	SyntheticEvent,
	useMemo,
	useState,
} from 'react'

type Suggestion = {
	value: string
	unrestricted_value: string
	data: {
		inn: string
		kpp: string
		ogrn: string
		address: { value: string; unrestricted_value: string }
		name: { full_with_opf: string }
	}
}

export default function CreateCompanyPage() {
	const router = useRouter()
	const { lang } = useParams() as { lang: string }

	// ⚙️ Состояние формы
	const [name, setName] = useState('')
	const [inn, setInn] = useState('')
	const [kpp, setKpp] = useState('')
	const [ogrn, setOgrn] = useState('')
	const [address, setAddress] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [website, setWebsite] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	// Подсказки DaData
	const [options, setOptions] = useState<Suggestion[]>([])
	const [fetching, setFetching] = useState(false)
	const query = useMemo(() => name, [name])

	// Запрос к DaData
	useMemo(() => {
		if (query.length < 3) {
			setOptions([])
			return
		}
		let active = true
		setFetching(true)
		fetch(
			'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`,
				},
				body: JSON.stringify({ query, count: 5 }),
			}
		)
			.then(r => r.json())
			.then(json => {
				if (active) setOptions(json.suggestions || [])
			})
			.catch(console.error)
			.finally(() => setFetching(false))

		return () => {
			active = false
		}
	}, [query])

	const handleSelect = (
		_e: SyntheticEvent,
		value: Suggestion | string | null
	) => {
		if (!value) return
		if (typeof value === 'string') {
			setName(value)
			setInn('')
			setKpp('')
			setOgrn('')
			setAddress('')
		} else {
			setName(value.data.name.full_with_opf)
			setInn(value.data.inn)
			setKpp(value.data.kpp)
			setOgrn(value.data.ogrn)
			setAddress(value.data.address.unrestricted_value)
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await axiosWithAuth.post('/companies', {
				name,
				email,
				phone,
				website,
				address,
				inn,
				kpp,
				ogrn,
			})
			router.push(`/${lang}/companies`)
		} catch (err: any) {
			setError(err.response?.data?.message || 'Ошибка при создании')
		} finally {
			setLoading(false)
		}
	}

	return (
		<PageContainer
			title='Создать компанию'
			description='Форма для добавления компании'
		>
			<Breadcrumb title='Компании' subtitle='Создать' />

			<ParentCard title='Новая компания'>
				<Box sx={{ p: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							{/* Название с автодополнением */}
							<Grid size={{ xs: 12, md: 6 }}>
								<Typography variant='subtitle2' gutterBottom>
									Название компании
								</Typography>
								<Autocomplete<Suggestion, false, false, true>
									freeSolo
									options={options}
									getOptionLabel={opt =>
										typeof opt === 'string' ? opt : opt.value
									}
									loading={fetching}
									onInputChange={(_e, v) => setName(v)}
									onChange={handleSelect}
									renderInput={(params: AutocompleteRenderInputParams) => (
										<TextField
											{...params}
											placeholder='Начните ввод...'
											fullWidth
											required
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{fetching && <CircularProgress size={20} />}
														{params.InputProps.endAdornment}
													</>
												),
											}}
										/>
									)}
								/>
							</Grid>

							{/* ИНН / КПП / ОГРН */}
							<Grid size={{ xs: 12, md: 2 }}>
								<Typography variant='subtitle2' gutterBottom>
									ИНН
								</Typography>
								<TextField
									value={inn}
									fullWidth
									InputProps={{ readOnly: true }}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 2 }}>
								<Typography variant='subtitle2' gutterBottom>
									КПП
								</Typography>
								<TextField
									value={kpp}
									fullWidth
									InputProps={{ readOnly: true }}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 2 }}>
								<Typography variant='subtitle2' gutterBottom>
									ОГРН
								</Typography>
								<TextField
									value={ogrn}
									fullWidth
									InputProps={{ readOnly: true }}
								/>
							</Grid>

							{/* Адрес */}
							<Grid size={12}>
								<Typography variant='subtitle2' gutterBottom>
									Адрес
								</Typography>
								<TextField
									value={address}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setAddress(e.target.value)
									}
									placeholder='Улица, дом…'
									fullWidth
								/>
							</Grid>

							{/* Email / Телефон / Сайт */}
							<Grid size={{ xs: 12, md: 4 }}>
								<Typography variant='subtitle2' gutterBottom>
									Email
								</Typography>
								<TextField
									value={email}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setEmail(e.target.value)
									}
									type='email'
									fullWidth
									required
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Typography variant='subtitle2' gutterBottom>
									Телефон
								</Typography>
								<TextField
									value={phone}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setPhone(e.target.value)
									}
									placeholder='+7 (___) ___-__-__'
									fullWidth
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Typography variant='subtitle2' gutterBottom>
									Сайт
								</Typography>
								<TextField
									value={website}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setWebsite(e.target.value)
									}
									placeholder='https://'
									fullWidth
								/>
							</Grid>

							{/* Кнопка */}
							<Grid size={12}>
								<Button
									type='submit'
									variant='contained'
									color='primary'
									disabled={loading}
								>
									{loading ? 'Сохраняем…' : 'Создать'}
								</Button>
							</Grid>
						</Grid>
					</form>
				</Box>
			</ParentCard>
		</PageContainer>
	)
}
