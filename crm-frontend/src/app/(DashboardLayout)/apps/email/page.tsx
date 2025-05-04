// src/app/(DashboardLayout)/apps/email/page.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { fetchCurrentUser, selectAuth } from '@/store/apps/auth/AuthSlice'
import { useDispatch, useSelector } from '@/store/hooks'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import EmailsApp from '@/app/components/apps/email'
import PageContainer from '@/app/components/container/PageContainer'
import AppCard from '@/app/components/shared/AppCard'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export default function EmailPage() {
	const dispatch = useDispatch()
	const router = useRouter()

	// селектор отдаёт { user, status }
	const { user, status } = useSelector(selectAuth)

	// стартовый эффект — запросим текущего юзера, если ещё не делали
	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchCurrentUser())
		}
	}, [status, dispatch])

	// после того как запрос завершился, и юзера нет — редирект
	useEffect(() => {
		if ((status === 'succeeded' || status === 'failed') && !user) {
			router.push('/login')
		}
	}, [status, user, router])

	// пока идёт initial fetch
	if (status === 'idle' || status === 'loading') {
		return (
			<Box
				sx={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	// если пользователь не залогинен, мы уже редиректим, здесь можно ничего не показывать
	if (!user) {
		return null
	}

	// всё готово — рендерим приложение
	return (
		<PageContainer title='Email' description='this is Email'>
			<Breadcrumb title='Email app' subtitle='Look at Inbox'>
				<Image
					src='/images/breadcrumb/emailSv.png'
					alt='emailIcon'
					width={195}
					height={195}
				/>
			</Breadcrumb>
			<AppCard>
				<EmailsApp />
			</AppCard>
		</PageContainer>
	)
}
