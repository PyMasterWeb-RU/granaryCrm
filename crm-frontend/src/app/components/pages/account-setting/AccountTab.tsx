'use client'

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
import axios from 'axios'
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
	const response = await axios.get('/api/users/me')
	return response.data
}

const updateProfile = async (data: Partial<UserProfile>) => {
	const response = await axios.patch('/api/users/me', data)
	return response.data
}

const uploadAvatar = async (file: File) => {
	const formData = new FormData()
	formData.append('avatar', file)
	const response = await axios.post('/api/users/me/avatar', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return response.data
}

const AccountTab = () => {
	const queryClient = useQueryClient()
	const { data: profile, isLoading } = useQuery({
		queryKey: ['profile'],
		queryFn: fetchProfile,
	})

	const [formData, setFormData] = useState({ name: '', email: '' })
	const [avatarFile, setAvatarFile] = useState<File | null>(null)

	useEffect(() => {
		if (profile) {
			setFormData({ name: profile.name, email: profile.email })
		}
	}, [profile])

	const profileMutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			alert('Профиль обновлен!')
		},
	})

	const avatarMutation = useMutation({
		mutationFn: uploadAvatar,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			setAvatarFile(null)
			alert('Аватар обновлен!')
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

	return (
		<Grid container spacing={3}>
			{/* Change Profile */}
			<Grid item xs={12} lg={6}>
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
										disabled={!avatarFile}
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
			<Grid item xs={12} lg={6}>
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
								<Grid item xs={12}>
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
								<Grid item xs={12}>
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
