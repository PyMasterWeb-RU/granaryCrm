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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel'
import CustomTextField from '../../forms/theme-elements/CustomTextField'
import BlankCard from '../../shared/BlankCard'

interface UserProfile {
	id: string
	name: string
	email: string
	avatar?: string
}

// API запросы
const fetchProfile = async () => {
	const response = await axiosWithAuth.get('/users/me')
	return response.data
}

const updateProfile = async (data: Partial<UserProfile>) => {
	const response = await axiosWithAuth.patch('/users/me', { name: data.name })
	return response.data
}

const uploadAvatar = async (file: File) => {
	const formData = new FormData()
	formData.append('avatar', file)
	const response = await axiosWithAuth.post('/users/me/avatar', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return response.data
}

const AccountTab = () => {
	const queryClient = useQueryClient()
	const [formData, setFormData] = useState({ name: '', email: '' })
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [error, setError] = useState<string | null>(null)

	const { data: profile, isLoading } = useQuery({
		queryKey: ['profile'],
		queryFn: fetchProfile,
	})

	useEffect(() => {
		if (profile) {
			setFormData({ name: profile.name || '', email: profile.email || '' })
		}
	}, [profile])

	const profileMutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			setError(null)
		},
		onError: (err: any) => {
			setError(
				'Не удалось обновить профиль: ' + (err.message || 'Неизвестная ошибка')
			)
		},
	})

	const avatarMutation = useMutation({
		mutationFn: uploadAvatar,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			setAvatarFile(null)
			setError(null)
		},
		onError: (err: any) => {
			setError(
				'Не удалось загрузить аватар: ' + (err.message || 'Неизвестная ошибка')
			)
		},
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setAvatarFile(e.target.files[0])
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		profileMutation.mutate(formData)
	}

	const handleAvatarUpload = () => {
		if (avatarFile) {
			avatarMutation.mutate(avatarFile)
		}
	}

	if (isLoading) return <Typography>Загрузка...</Typography>
	if (!profile) return <Typography>Ошибка загрузки профиля</Typography>

	return (
		<Grid container spacing={3}>
			{error && (
				<Grid size={{ xs: 12 }}>
					<Typography color='error'>{error}</Typography>
				</Grid>
			)}
			{/* Change Profile */}
			<Grid size={{ xs: 12, lg: 6 }}>
				<BlankCard>
					<CardContent>
						<Typography variant='h5' mb={1}>
							Change Profile
						</Typography>
						<Typography color='textSecondary' mb={3}>
							Change your profile picture from here
						</Typography>
						<Box textAlign='center' display='flex' justifyContent='center'>
							<Box>
								<Avatar
									src={profile?.avatar || '/images/profile/user-1.jpg'}
									alt='user'
									sx={{ width: 120, height: 120, margin: '0 auto' }}
								/>
								<Stack
									direction='row'
									justifyContent='center'
									spacing={2}
									my={3}
								>
									<Button variant='contained' color='primary' component='label'>
										Upload
										<input
											hidden
											accept='image/*'
											type='file'
											onChange={handleAvatarChange}
										/>
									</Button>
									<Button
										variant='outlined'
										color='error'
										onClick={handleAvatarUpload}
										disabled={!avatarFile || avatarMutation.isPending}
									>
										Save Avatar
									</Button>
								</Stack>
								<Typography variant='subtitle1' color='textSecondary' mb={4}>
									Allowed JPG, GIF or PNG. Max size of 800K
								</Typography>
							</Box>
						</Box>
					</CardContent>
				</BlankCard>
			</Grid>
			{/* Edit Details */}
			<Grid size={{ xs: 12, lg: 6 }}>
				<BlankCard>
					<CardContent>
						<Typography variant='h5' mb={1}>
							Personal Details
						</Typography>
						<Typography color='textSecondary' mb={3}>
							To change your personal details, edit and save from here
						</Typography>
						<form onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid size={{ xs: 12 }}>
									<CustomFormLabel sx={{ mt: 0 }} htmlFor='name'>
										Your Name
									</CustomFormLabel>
									<CustomTextField
										id='name'
										name='name'
										value={formData.name}
										onChange={handleChange}
										variant='outlined'
										fullWidth
									/>
								</Grid>
								<Grid size={{ xs: 12 }}>
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
										disabled
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
									disabled={profileMutation.isPending}
								>
									Save
								</Button>
								<Button
									size='large'
									variant='text'
									color='error'
									onClick={() =>
										setFormData({
											name: profile?.name || '',
											email: profile?.email || '',
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

export default AccountTab
