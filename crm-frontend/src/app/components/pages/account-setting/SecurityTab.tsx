'use client'

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
import axios from 'axios'
import React from 'react'
import BlankCard from '../../shared/BlankCard'

interface Device {
	id: string
	name: string
	lastSeen: string
	location: string
}

const fetchDevices = async () => {
	const response = await axios.get('/api/users/me/devices')
	return response.data
}

const logoutAllDevices = async () => {
	const response = await axios.post('/api/users/me/logout-all')
	return response.data
}

const SecurityTab = () => {
	const queryClient = useQueryClient()
	const { data: devices, isLoading } = useQuery({
		queryKey: ['devices'],
		queryFn: fetchDevices,
	})

	const mutation = useMutation({
		mutationFn: logoutAllDevices,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['devices'] })
			alert('Выход выполнен со всех устройств!')
		},
	})

	if (isLoading) return <Typography>Загрузка...</Typography>

	return (
		<Grid container spacing={3} justifyContent='center'>
			<Grid item xs={12} lg={8}>
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
			<Grid item xs={12} lg={4}>
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
						<Button
							variant='contained'
							color='primary'
							onClick={() => mutation.mutate()}
							disabled={mutation.isPending}
						>
							Sign out from all devices
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
										<IconButton>
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
