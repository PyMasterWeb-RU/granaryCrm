'use client'
import { fetchTemplates } from '@/store/apps/email/EmailSlice'
import { useDispatch, useSelector } from '@/store/hooks'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useEffect, useState } from 'react'
import EmailContent from './EmailContent'
import EmailFilter from './EmailFilter'
import EmailList from './EmailList'
import EmailSearch from './EmailSearch'

const drawerWidth = 240
const secdrawerWidth = 340

export default function EmailsApp() {
	const [leftOpen, setLeftOpen] = useState(false)
	const [rightOpen, setRightOpen] = useState(false)
	const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
	const dispatch = useDispatch()
	const user = useSelector(state => state.auth.user)

	useEffect(() => {
		if (!user) return

		fetch(`${process.env.NEXT_PUBLIC_API_URL}/email-templates`, {
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			cache: 'no-store',
		})
			.then(res => {
				if (!res.ok) {
					throw new Error(`Ошибка сети: ${res.status}`)
				}
				return res.json()
			})
			.then(data => dispatch(fetchTemplates(data)))
			.catch(err => console.error('Не удалось загрузить шаблоны писем:', err))
	}, [dispatch, user])

	return (
		<>
			<Drawer
				open={leftOpen}
				onClose={() => setLeftOpen(false)}
				variant={lgUp ? 'permanent' : 'temporary'}
				sx={{
					width: drawerWidth,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						position: 'relative',
						zIndex: 2,
					},
				}}
			>
				<EmailFilter />
			</Drawer>

			<Box
				sx={{
					minWidth: secdrawerWidth,
					width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
					flexShrink: 0,
				}}
			>
				<EmailSearch onClick={() => setLeftOpen(true)} />
				<EmailList showRightSidebar={() => setRightOpen(true)} />
			</Box>

			{mdUp ? (
				<Drawer
					anchor='right'
					variant='permanent'
					sx={{
						width: 200,
						flex: '1 1 auto',
						'& .MuiDrawer-paper': { position: 'relative' },
					}}
				>
					<EmailContent />
				</Drawer>
			) : (
				<Drawer
					anchor='right'
					open={rightOpen}
					onClose={() => setRightOpen(false)}
					variant='temporary'
					sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: '85%' } }}
				>
					<Box p={3}>
						<Button
							variant='outlined'
							size='small'
							onClick={() => setRightOpen(false)}
							sx={{ mb: 3, display: { xs: 'block', md: 'none' } }}
						>
							Назад
						</Button>
						<EmailContent />
					</Box>
				</Drawer>
			)}
		</>
	)
}
