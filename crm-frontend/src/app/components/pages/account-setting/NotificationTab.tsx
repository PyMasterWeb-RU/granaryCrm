'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import {
	Avatar,
	Box,
	Button,
	CardContent,
	Grid,
	Stack,
	Typography,
} from '@mui/material'
import { IconBell } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel'
import CustomSwitch from '../../forms/theme-elements/CustomSwitch'
import CustomTextField from '../../forms/theme-elements/CustomTextField'
import BlankCard from '../../shared/BlankCard'

interface NotificationSettings {
	notificationsEnabled: boolean
	email: string
}

const fetchNotificationSettings = async () => {
	const response = await axiosWithAuth.get('/users/me')
	return {
		notificationsEnabled: response.data.notificationsEnabled,
		email: response.data.email,
	}
}

const updateNotificationSettings = async (
	data: Partial<NotificationSettings>
) => {
	const response = await axiosWithAuth.patch('/users/me', data)
	return response.data
}

const NotificationTab = () => {
	const queryClient = useQueryClient()
	const {
		data: settings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['notificationSettings'],
		queryFn: fetchNotificationSettings,
	})
	const [formError, setFormError] = useState<string | null>(null)

	const mutation = useMutation({
		mutationFn: updateNotificationSettings,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
			setFormError(null)
		},
		onError: (err: any) => {
			setFormError(
				'Не удалось сохранить настройки: ' +
					(err.message || 'Неизвестная ошибка')
			)
		},
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target
		mutation.mutate({ [name]: checked })
	}

	if (isLoading) return <Typography>Загрузка...</Typography>
	if (error) return <Typography>Ошибка загрузки настроек</Typography>

	return (
		<Grid container spacing={3} justifyContent='center'>
			<Grid size={{ xs: 12, lg: 9 }}>
				<BlankCard>
					<CardContent>
						<Typography variant='h4' mb={2}>
							Notification Preferences
						</Typography>
						<Typography color='textSecondary' mb={3}>
							Manage your notification settings.
						</Typography>
						{formError && (
							<Typography color='error' mb={2}>
								{formError}
							</Typography>
						)}
						<CustomFormLabel htmlFor='email'>Email Address</CustomFormLabel>
						<CustomTextField
							id='email'
							value={settings?.email || ''}
							variant='outlined'
							fullWidth
							disabled
						/>
						<Typography color='textSecondary' mb={3}>
							Used for notifications.
						</Typography>
						<Stack direction='row' spacing={2} mt={4}>
							<Avatar
								variant='rounded'
								sx={{
									bgcolor: 'grey.100',
									color: 'grey.500',
									width: 48,
									height: 48,
								}}
							>
								<IconBell size='22' />
							</Avatar>
							<Box>
								<Typography variant='h6' mb={1}>
									Enable Notifications
								</Typography>
								<Typography variant='subtitle1' color='textSecondary'>
									Receive notifications via email and in-app.
								</Typography>
							</Box>
							<Box sx={{ ml: 'auto !important' }}>
								<CustomSwitch
									id='notificationsEnabled'
									name='notificationsEnabled'
									checked={settings?.notificationsEnabled || false}
									onChange={handleChange}
								/>
							</Box>
						</Stack>
					</CardContent>
				</BlankCard>
			</Grid>
			<Stack direction='row' spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
				<Button size='large' variant='contained' color='primary' disabled>
					Save
				</Button>
				<Button size='large' variant='text' color='error' disabled>
					Cancel
				</Button>
			</Stack>
		</Grid>
	)
}

export default NotificationTab
