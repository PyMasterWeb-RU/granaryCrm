'use client'

import {
	Box,
	Button,
	Divider,
	FormControlLabel,
	FormGroup,
	Stack,
	Typography,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
import AuthSocialButtons from './AuthSocialButtons'

import { useAuth } from '@/app/providers/AuthContext' // будем использовать AuthContext для обновления состояния после логина
import axiosWithAuth from '@/lib/axiosWithAuth'

interface loginType {
	title?: string
	subtitle?: JSX.Element
	subtext?: JSX.Element
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
	const router = useRouter()
	const { fetchUser } = useAuth() // подключаемся к AuthContext
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			await axiosWithAuth.post('/auth/login', {
				email,
				password,
			})

			// После успешного логина подгружаем профиль
			await fetchUser()

			// Перенаправляем пользователя на дашборд
			router.push('/')
		} catch (err: any) {
			console.error(err)
			setError('Неверный логин или пароль')
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

			<AuthSocialButtons title='Sign in with' />

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
						или войдите с помощью
					</Typography>
				</Divider>
			</Box>

			<form onSubmit={handleLogin}>
				<Stack spacing={2} mt={2}>
					<Box>
						<CustomFormLabel htmlFor='email'>Имя пользователя</CustomFormLabel>
						<CustomTextField
							id='email'
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

					<Stack
						justifyContent='space-between'
						direction='row'
						alignItems='center'
						my={2}
					>
						<FormGroup>
							<FormControlLabel
								control={<CustomCheckbox defaultChecked />}
								label='Запомнить устройство'
							/>
						</FormGroup>
						<Typography
							component={Link}
							href='/auth/auth1/forgot-password'
							fontWeight='500'
							sx={{ textDecoration: 'none', color: 'primary.main' }}
						>
							Забыли пароль?
						</Typography>
					</Stack>

					<Button
						color='primary'
						variant='contained'
						size='large'
						fullWidth
						type='submit'
						disabled={loading}
					>
						{loading ? 'Вход...' : 'Войти'}
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

export default AuthLogin
