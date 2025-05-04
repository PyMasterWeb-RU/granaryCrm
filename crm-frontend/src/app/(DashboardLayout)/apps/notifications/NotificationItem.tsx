// src/app/(DashboardLayout)/notifications/NotificationItem.tsx
'use client'

import { Notification } from '@/lib/notifications'
import {
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material'
import NextLink from 'next/link'

interface Props {
	notification: Notification
	onClick: () => void
}

export default function NotificationItem({ notification, onClick }: Props) {
	const { message, link, isRead, createdAt } = notification

	// Внешний ListItem, внутри — либо кнопка (если есть link), либо просто текст
	return (
		<ListItem disablePadding sx={{ mb: 1 }}>
			{link ? (
				<ListItemButton
					component={NextLink}
					href={link} // <--- теперь всегда строка, благодаря условию выше
					onClick={onClick}
					sx={{
						bgcolor: isRead ? 'background.paper' : 'action.hover',
						borderRadius: 1,
					}}
				>
					<ListItemText
						primary={
							<Typography
								variant='body1'
								sx={{ fontWeight: isRead ? 'regular' : 'bold' }}
							>
								{message}
							</Typography>
						}
						secondary={new Date(createdAt).toLocaleString()}
					/>
				</ListItemButton>
			) : (
				<ListItemText
					primary={
						<Typography
							variant='body1'
							sx={{
								fontWeight: isRead ? 'regular' : 'bold',
								bgcolor: isRead ? 'background.paper' : 'action.hover',
								p: 1,
								borderRadius: 1,
							}}
							onClick={onClick}
						>
							{message}
						</Typography>
					}
					secondary={new Date(createdAt).toLocaleString()}
				/>
			)}
		</ListItem>
	)
}
