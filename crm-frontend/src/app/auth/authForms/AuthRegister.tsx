'use client'

import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { registerType } from '@/app/(DashboardLayout)/types/auth/auth'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
import AuthSocialButtons from './AuthSocialButtons'

import axiosWithAuth from '@/lib/axiosWithAuth'

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
	const router = useRouter()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			await axiosWithAuth.post('/auth/register', {
				name,
				email,
				password,
			})

			// После успешной регистрации можно перенаправить на страницу логина
			router.push('/auth/login')
		} catch (err: any) {
			console.error(err)
			setError('Ошибка при регистрации. Попробуйте снова.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			{title && (
				<Typography fontWeight='700' variant='h3' mb={1}>
					{title}
				</Typography>
			)}

			{subtext}
			<AuthSocialButtons title='Sign up with' />

			<Box mt={3}>
				<Divider>
					<Typography
						component='span'
						color='textSecondary'
						variant='h6'
						fontWeight='400'
						position='relative'
						px={2}
					>
						или зарегистрируйтесь с помощью
					</Typography>
				</Divider>
			</Box>

			<form onSubmit={handleRegister}>
				<Stack mb={3} spacing={2} mt={3}>
					<Box>
						<CustomFormLabel htmlFor='name'>Имя пользователя</CustomFormLabel>
						<CustomTextField
							id='name'
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
							variant='outlined'
							fullWidth
							required
						/>
					</Box>

					<Box>
						<CustomFormLabel htmlFor='email'>Email</CustomFormLabel>
						<CustomTextField
							id='email'
							type='email'
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
							variant='outlined'
							fullWidth
							required
						/>
					</Box>

					<Box>
						<CustomFormLabel htmlFor='password'>Пароль</CustomFormLabel>
						<CustomTextField
							id='password'
							type='password'
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setPassword(e.target.value)
							}
							variant='outlined'
							fullWidth
							required
						/>
					</Box>

					<Button
						color='primary'
						variant='contained'
						size='large'
						fullWidth
						type='submit'
						disabled={loading}
					>
						{loading ? 'Регистрация...' : 'Зарегистрироваться'}
					</Button>

					{error && (
						<Typography color='error' mt={2}>
							{error}
						</Typography>
					)}
				</Stack>
			</form>

			{subtitle}
		</>
	)
}

export default AuthRegister
