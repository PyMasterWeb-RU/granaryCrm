'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import { Button, CardContent, Grid, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel'
import CustomSwitch from '../../forms/theme-elements/CustomSwitch'
import CustomTextField from '../../forms/theme-elements/CustomTextField'
import BlankCard from '../../shared/BlankCard'

interface EmailAccount {
	id: string
	email: string
	smtpHost: string
	smtpPort: number
	smtpSecure: boolean
	imapHost?: string
	imapPort?: number
	imapSecure?: boolean
	password?: string
}

// API запросы
const fetchEmailAccount = async () => {
	const response = await axiosWithAuth.get('/email-accounts/me')
	return response.data
}

const updateEmailAccount = async (data: Partial<EmailAccount>) => {
	const response = await axiosWithAuth.post('/email-accounts', data)
	return response.data
}

const EmailSettingsTab = () => {
	const queryClient = useQueryClient()
	const {
		data: emailAccount,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['emailAccount'],
		queryFn: fetchEmailAccount,
	})
	const [formData, setFormData] = useState({
		email: '',
		smtpHost: '',
		smtpPort: 587,
		smtpSecure: true,
		imapHost: '',
		imapPort: 993,
		imapSecure: true,
		password: '',
	})
	const [formError, setFormError] = useState<string | null>(null)

	React.useEffect(() => {
		if (emailAccount) {
			setFormData({
				email: emailAccount.email || '',
				smtpHost: emailAccount.smtpHost || '',
				smtpPort: emailAccount.smtpPort || 587,
				smtpSecure: emailAccount.smtpSecure ?? true,
				imapHost: emailAccount.imapHost || '',
				imapPort: emailAccount.imapPort || 993,
				imapSecure: emailAccount.imapSecure ?? true,
				password: '',
			})
		}
	}, [emailAccount])

	const mutation = useMutation({
		mutationFn: updateEmailAccount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['emailAccount'] })
			setFormError(null)
		},
		onError: (err: any) => {
			setFormError(
				'Ошибка при сохранении настроек: ' +
					(err.message || 'Неизвестная ошибка')
			)
		},
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		mutation.mutate(formData)
	}

	if (isLoading) return <Typography>Загрузка...</Typography>
	if (error) return <Typography>Ошибка загрузки настроек</Typography>

	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12 }}>
				<BlankCard>
					<CardContent>
						<Typography variant='h5' mb={1}>
							Email Settings
						</Typography>
						<Typography color='textSecondary' mb={3}>
							Configure your SMTP and IMAP settings for sending and receiving
							emails.
						</Typography>
						{formError && (
							<Typography color='error' mb={2}>
								{formError}
							</Typography>
						)}
						<form onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='email'>
										Email Address
									</CustomFormLabel>
									<CustomTextField
										id='email'
										name='email'
										value={formData.email}
										onChange={handleChange}
										variant='outlined'
										fullWidth
										required
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='password'>
										Password
									</CustomFormLabel>
									<CustomTextField
										id='password'
										name='password'
										type='password'
										value={formData.password}
										onChange={handleChange}
										variant='outlined'
										fullWidth
										placeholder='Enter new password'
									/>
								</Grid>
								{/* SMTP Settings */}
								<Grid size={{ xs: 12 }}>
									<Typography variant='h6' mt={2}>
										SMTP Settings
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='smtpHost'>
										SMTP Host
									</CustomFormLabel>
									<CustomTextField
										id='smtpHost'
										name='smtpHost'
										value={formData.smtpHost}
										onChange={handleChange}
										variant='outlined'
										fullWidth
										required
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='smtpPort'>
										SMTP Port
									</CustomFormLabel>
									<CustomTextField
										id='smtpPort'
										name='smtpPort'
										type='number'
										value={formData.smtpPort}
										onChange={handleChange}
										variant='outlined'
										fullWidth
										required
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='smtpSecure'>
										Use SSL/TLS
									</CustomFormLabel>
									<CustomSwitch
										id='smtpSecure'
										name='smtpSecure'
										checked={formData.smtpSecure}
										onChange={handleChange}
									/>
								</Grid>
								{/* IMAP Settings */}
								<Grid size={{ xs: 12 }}>
									<Typography variant='h6' mt={2}>
										IMAP Settings
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='imapHost'>
										IMAP Host
									</CustomFormLabel>
									<CustomTextField
										id='imapHost'
										name='imapHost'
										value={formData.imapHost}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='imapPort'>
										IMAP Port
									</CustomFormLabel>
									<CustomTextField
										id='imapPort'
										name='imapPort'
										type='number'
										value={formData.imapPort}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='imapSecure'>
										Use SSL/TLS
									</CustomFormLabel>
									<CustomSwitch
										id='imapSecure'
										name='imapSecure'
										checked={formData.imapSecure}
										onChange={handleChange}
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
									onClick={() => setFormData({ ...formData, password: '' })}
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

export default EmailSettingsTab
