'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import {
	Avatar,
	Box,
	Button,
	CardContent,
	Divider,
	Grid,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import {
	IconDeviceLaptop,
	IconDeviceMobile,
	IconDotsVertical,
} from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import BlankCard from '../../shared/BlankCard'

interface Device {
	id: string
	name: string
	lastSeen: string
	location: string
}

const fetchDevices = async () => {
	const response = await axiosWithAuth.get('/users/me/devices')
	return response.data
}

const logoutDevice = async (sessionId: string) => {
	const response = await axiosWithAuth.post(
		`/users/me/devices/${sessionId}/logout`
	)
	return response.data
}

const logoutAllDevices = async () => {
	const response = await axiosWithAuth.post('/users/me/logout-all')
	return response.data
}

const SecurityTab = () => {
	const queryClient = useQueryClient()
	const {
		data: devices,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['devices'],
		queryFn: fetchDevices,
	})
	const [formError, setFormError] = useState<string | null>(null)

	const logoutMutation = useMutation({
		mutationFn: logoutDevice,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['devices'] })
			setFormError(null)
		},
		onError: (err: any) => {
			setFormError(
				'Не удалось завершить сессию: ' + (err.message || 'Неизвестная ошибка')
			)
		},
	})

	const logoutAllMutation = useMutation({
		mutationFn: logoutAllDevices,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['devices'] })
			setFormError(null)
		},
		onError: (err: any) => {
			setFormError(
				'Не удалось выйти со всех устройств: ' +
					(err.message || 'Неизвестная ошибка')
			)
		},
	})

	if (isLoading) return <Typography>Загрузка...</Typography>
	if (error) return <Typography>Ошибка загрузки устройств</Typography>

	return (
		<Grid container spacing={3} justifyContent='center'>
			<Grid size={{ xs: 12, lg: 8 }}>
				<BlankCard>
					<CardContent>
						<Typography variant='h4' mb={2}>
							Two-factor Authentication
						</Typography>
						<Stack
							direction='row'
							justifyContent='space-between'
							alignItems='center'
							mb={4}
						>
							<Typography variant='subtitle1' color='textSecondary'>
								Two-factor authentication is not enabled yet.
							</Typography>
							<Button variant='contained' color='primary' disabled>
								Enable (Coming Soon)
							</Button>
						</Stack>
					</CardContent>
				</BlankCard>
			</Grid>
			<Grid size={{ xs: 12, lg: 4 }}>
				<BlankCard>
					<CardContent>
						<Avatar
							variant='rounded'
							sx={{
								bgcolor: 'primary.light',
								color: 'primary.main',
								width: 48,
								height: 48,
							}}
						>
							<IconDeviceLaptop size='26' />
						</Avatar>
						<Typography variant='h5' mt={2}>
							Devices
						</Typography>
						<Typography color='textSecondary' mt={1} mb={2}>
							Manage your active devices.
						</Typography>
						{formError && (
							<Typography color='error' mb={2}>
								{formError}
							</Typography>
						)}
						<Button
							variant='contained'
							color='primary'
							onClick={() => logoutAllMutation.mutate()}
							disabled={logoutAllMutation.isPending}
						>
							Sign out from all other devices
						</Button>
						{devices?.map((device: Device) => (
							<React.Fragment key={device.id}>
								<Stack
									direction='row'
									spacing={2}
									py={2}
									mt={3}
									alignItems='center'
								>
									{device.name.includes('Mobile') ? (
										<IconDeviceMobile size='26' />
									) : (
										<IconDeviceLaptop size='26' />
									)}
									<Box>
										<Typography variant='h6'>{device.name}</Typography>
										<Typography variant='subtitle1' color='textSecondary'>
											{device.location},{' '}
											{new Date(device.lastSeen).toLocaleString()}
										</Typography>
									</Box>
									<Box sx={{ ml: 'auto !important' }}>
										<IconButton
											onClick={() => logoutMutation.mutate(device.id)}
											disabled={logoutMutation.isPending}
										>
											<IconDotsVertical size='22' />
										</IconButton>
									</Box>
								</Stack>
								<Divider />
							</React.Fragment>
						))}
						<Stack>
							<Button variant='text' color='primary'>
								Need Help?
							</Button>
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

export default SecurityTab
