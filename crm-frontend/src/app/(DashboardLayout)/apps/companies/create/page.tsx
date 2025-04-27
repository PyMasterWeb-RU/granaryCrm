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
	Grid,
	TextField,
	Typography,
} from '@mui/material'
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
	const [nameOptions, setNameOptions] = useState<Suggestion[]>([])
	const [nameFetching, setNameFetching] = useState(false)
	const [innOptions, setInnOptions] = useState<Suggestion[]>([])
	const [innFetching, setInnFetching] = useState(false)

	// Подсказки по названию
	useMemo(() => {
		if (name.length < 3) {
			setNameOptions([])
			return
		}
		let active = true
		setNameFetching(true)
		fetch(
			'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`,
				},
				body: JSON.stringify({ query: name, count: 5 }),
			}
		)
			.then(r => r.json())
			.then(json => {
				if (active) setNameOptions(json.suggestions || [])
			})
			.catch(console.error)
			.finally(() => setNameFetching(false))
		return () => {
			active = false
		}
	}, [name])

	// Подсказки по ИНН
	useMemo(() => {
		if (inn.length < 3) {
			setInnOptions([])
			return
		}
		let active = true
		setInnFetching(true)
		fetch(
			'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`,
				},
				body: JSON.stringify({ query: inn, count: 5 }),
			}
		)
			.then(r => r.json())
			.then(json => {
				if (active) setInnOptions(json.suggestions || [])
			})
			.catch(console.error)
			.finally(() => setInnFetching(false))
		return () => {
			active = false
		}
	}, [inn])

	// Выбор из подсказок по названию
	const handleSelectByName = (
		_e: SyntheticEvent,
		value: Suggestion | string | null
	) => {
		if (!value || typeof value === 'string') return
		setName(value.data.name.full_with_opf)
		setInn(value.data.inn)
		setKpp(value.data.kpp)
		setOgrn(value.data.ogrn)
		setAddress(value.data.address.unrestricted_value)
	}

	// Выбор из подсказок по ИНН
	const handleSelectByInn = (
		_e: SyntheticEvent,
		value: Suggestion | string | null
	) => {
		if (!value || typeof value === 'string') return
		setInn(value.data.inn)
		setName(value.data.name.full_with_opf)
		setKpp(value.data.kpp)
		setOgrn(value.data.ogrn)
		setAddress(value.data.address.unrestricted_value)
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await axiosWithAuth.post('/accounts', {
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
							{/* По названию */}
							<Grid size={{ xs: 12, md: 6 }}>
								<Typography variant='subtitle2' gutterBottom>
									Название компании
								</Typography>
								<Autocomplete<Suggestion, false, false, true>
									freeSolo
									options={nameOptions}
									getOptionLabel={opt =>
										typeof opt === 'string' ? opt : opt.value
									}
									loading={nameFetching}
									inputValue={name}
									onInputChange={(_e, v) => setName(v)}
									onChange={handleSelectByName}
									renderInput={(params: AutocompleteRenderInputParams) => (
										<TextField
											{...params}
											placeholder='Начните ввод названия...'
											fullWidth
											required
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{nameFetching && <CircularProgress size={20} />}
														{params.InputProps.endAdornment}
													</>
												),
											}}
										/>
									)}
								/>
							</Grid>

							{/* По ИНН */}
							<Grid size={{ xs: 12, md: 2 }}>
								<Typography variant='subtitle2' gutterBottom>
									ИНН
								</Typography>
								<Autocomplete<Suggestion, false, false, true>
									freeSolo
									options={innOptions}
									getOptionLabel={opt =>
										typeof opt === 'string' ? opt : opt.data.inn
									}
									filterOptions={opts => opts}
									loading={innFetching}
									inputValue={inn}
									onInputChange={(_e, v) => setInn(v)}
									onChange={handleSelectByInn}
									renderOption={(props, opt) => (
										<li {...props} key={opt.data.inn}>
											{opt.data.name.full_with_opf} ({opt.data.inn})
										</li>
									)}
									renderInput={params => (
										<TextField
											{...params}
											placeholder='Введите ИНН'
											fullWidth
										/>
									)}
								/>
							</Grid>

							{/* КПП */}
							<Grid size={{ xs: 12, md: 2 }}>
								<Typography variant='subtitle2' gutterBottom>
									КПП
								</Typography>
								<TextField
									value={kpp}
									fullWidth
									InputProps={{ readOnly: true }}
									placeholder='—'
								/>
							</Grid>

							{/* ОГРН */}
							<Grid size={{ xs: 12, md: 2 }}>
								<Typography variant='subtitle2' gutterBottom>
									ОГРН
								</Typography>
								<TextField
									value={ogrn}
									fullWidth
									InputProps={{ readOnly: true }}
									placeholder='—'
								/>
							</Grid>

							{/* Остальные поля */}
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
									placeholder='example@mail.com'
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
