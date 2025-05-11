'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import { Button, CardContent, Grid, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel'
import CustomTextField from '../../forms/theme-elements/CustomTextField'
import BlankCard from '../../shared/BlankCard'

interface Company {
	id: string
	name: string
	industry?: string
	phone?: string
	email?: string
	address?: string
	inn?: string
	kpp?: string
	ogrn?: string
}

const fetchCompany = async () => {
	const response = await axiosWithAuth.get('/accounts/my')
	return response.data
}

const updateCompany = async (data: Partial<Company>) => {
	const response = await axiosWithAuth.patch('/accounts/my', data)
	return response.data
}

const BillsTab = () => {
	const queryClient = useQueryClient()
	const {
		data: company,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['company'],
		queryFn: fetchCompany,
	})
	const [formData, setFormData] = useState({
		name: '',
		industry: '',
		phone: '',
		email: '',
		address: '',
		inn: '',
		kpp: '',
		ogrn: '',
	})
	const [formError, setFormError] = useState<string | null>(null)

	useEffect(() => {
		if (company) {
			setFormData({
				name: company.name || '',
				industry: company.industry || '',
				phone: company.phone || '',
				email: company.email || '',
				address: company.address || '',
				inn: company.inn || '',
				kpp: company.kpp || '',
				ogrn: company.ogrn || '',
			})
		}
	}, [company])

	const mutation = useMutation({
		mutationFn: updateCompany,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['company'] })
			setFormError(null)
		},
		onError: (err: any) => {
			setFormError(
				'Не удалось сохранить данные компании: ' +
					(err.message || 'Неизвестная ошибка')
			)
		},
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		mutation.mutate(formData)
	}

	if (isLoading) return <Typography>Загрузка...</Typography>
	if (error) return <Typography>Ошибка загрузки данных компании</Typography>

	return (
		<Grid container spacing={3} justifyContent='center'>
			<Grid size={{ xs: 12, lg: 9 }}>
				<BlankCard>
					<CardContent>
						<Typography variant='h4' mb={2}>
							Company Information
						</Typography>
						<Typography color='textSecondary' mb={3}>
							Update your company details here.
						</Typography>
						{formError && (
							<Typography color='error' mb={2}>
								{formError}
							</Typography>
						)}
						<form onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='name'>
										Company Name*
									</CustomFormLabel>
									<CustomTextField
										id='name'
										name='name'
										value={formData.name}
										onChange={handleChange}
										variant='outlined'
										fullWidth
										required
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='industry'>
										Industry
									</CustomFormLabel>
									<CustomTextField
										id='industry'
										name='industry'
										value={formData.industry}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='phone'>
										Phone
									</CustomFormLabel>
									<CustomTextField
										id='phone'
										name='phone'
										value={formData.phone}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='email'>
										Email
									</CustomFormLabel>
									<CustomTextField
										id='email'
										name='email'
										value={formData.email}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='address'>
										Address
									</CustomFormLabel>
									<CustomTextField
										id='address'
										name='address'
										value={formData.address}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='inn'>
										INN
									</CustomFormLabel>
									<CustomTextField
										id='inn'
										name='inn'
										value={formData.inn}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='kpp'>
										KPP
									</CustomFormLabel>
									<CustomTextField
										id='kpp'
										name='kpp'
										value={formData.kpp}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='ogrn'>
										OGRN
									</CustomFormLabel>
									<CustomTextField
										id='ogrn'
										name='ogrn'
										value={formData.ogrn}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
							</Grid>
							<Stack
								direction='row'
								spacing={2}
								sx={{ justifyContent: 'end' }}
								mt={3}
							>
								<Button
									size='large'
									variant='contained'
									color='primary'
									type='submit'
									disabled={mutation.isPending}
								>
									Save
								</Button>
								<Button
									size='large'
									variant='text'
									color='error'
									onClick={() =>
										setFormData({
											name: company?.name || '',
											industry: company?.industry || '',
											phone: company?.phone || '',
											email: company?.email || '',
											address: company?.address || '',
											inn: company?.inn || '',
											kpp: company?.kpp || '',
											ogrn: company?.ogrn || '',
										})
									}
								>
									Cancel
								</Button>
							</Stack>
						</form>
					</CardContent>
				</BlankCard>
			</Grid>
		</Grid>
	)
}

export default BillsTab
