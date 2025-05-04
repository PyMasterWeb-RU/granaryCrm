// src/app/(DashboardLayout)/notifications/page.tsx
'use client'

import {
	fetchNotifications,
	fetchUnreadCount,
	markAllAsRead,
	markAsRead,
	Notification,
} from '@/lib/notifications'
import { useEffect, useState } from 'react'

import {
	Notifications as BellIcon,
	DoneAll as DoneAllIcon,
} from '@mui/icons-material'
import {
	Badge,
	Box,
	Button,
	CircularProgress,
	Container,
	IconButton,
	List,
	Typography,
} from '@mui/material'
import NotificationItem from './NotificationItem'

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const [unreadCount, setUnreadCount] = useState(0)

	const loadAll = async () => {
		setLoading(true)
		try {
			const [list, count] = await Promise.all([
				fetchNotifications(),
				fetchUnreadCount(),
			])
			setNotifications(list)
			setUnreadCount(count)
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadAll()
	}, [])

	const handleMarkAll = async () => {
		await markAllAsRead()
		await loadAll()
	}

	const handleMarkOne = async (id: string) => {
		await markAsRead(id)
		await loadAll()
	}

	return (
		<Container sx={{ py: 4 }}>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				mb={3}
			>
				<Typography variant='h4'>Уведомления</Typography>
				<Box>
					<IconButton onClick={loadAll}>
						<Badge badgeContent={unreadCount} color='error'>
							<BellIcon />
						</Badge>
					</IconButton>
					<Button
						startIcon={<DoneAllIcon />}
						onClick={handleMarkAll}
						sx={{ ml: 2 }}
					>
						Отметить все как прочитанные
					</Button>
				</Box>
			</Box>

			{loading ? (
				<Box textAlign='center' mt={6}>
					<CircularProgress />
				</Box>
			) : notifications.length === 0 ? (
				<Typography textAlign='center' color='text.secondary'>
					У вас нет уведомлений
				</Typography>
			) : (
				<List disablePadding>
					{notifications.map(n => (
						<NotificationItem
							key={n.id}
							notification={n}
							onClick={() => handleMarkOne(n.id)}
						/>
					))}
				</List>
			)}
		</Container>
	)
}
