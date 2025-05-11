import axiosWithAuth from '@/lib/axiosWithAuth'
import { useDispatch, useSelector } from '@/store/hooks'
import { Chat } from '@/types/chat'
import { CircularProgress, ListItemAvatar } from '@mui/material'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'
import { formatDistanceToNowStrict } from 'date-fns'
import React, { useEffect, useState } from 'react'
import Scrollbar from '../../custom-scroll/Scrollbar'

interface ChatListingProps {
	dealId?: string
	accountId?: string
}

const ChatListing: React.FC<ChatListingProps> = ({ dealId, accountId }) => {
	const dispatch = useDispatch()
	const [chats, setChats] = useState<Chat[]>([])
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	useEffect(() => {
		const fetchChats = async () => {
			setLoading(true)
			try {
				const params = new URLSearchParams()
				if (dealId) params.append('dealId', dealId)
				if (accountId) params.append('accountId', accountId)
				console.log('Fetching chats with params:', {
					dealId,
					accountId,
					url: `/chats?${params.toString()}`,
				})
				const res = await axiosWithAuth.get(`/chats?${params.toString()}`)
				setChats(res.data)
				dispatch({ type: 'fetchChats', payload: res.data })
				setError(null)
			} catch (err: any) {
				const errorMessage =
					err.response?.status === 404
						? 'Эндпоинт чатов не найден. Проверьте конфигурацию бэкенда.'
						: 'Не удалось загрузить чаты. Попробуйте позже.'
				setError(errorMessage)
				console.error('Ошибка загрузки чатов:', {
					message: err.message,
					status: err.response?.status,
					data: err.response?.data,
				})
			} finally {
				setLoading(false)
			}
		}
		fetchChats()
	}, [dealId, accountId, dispatch])

	const filterChats = (chats: Chat[], search: string) => {
		if (!search) return chats
		return chats.filter(chat =>
			(chat.name || chat.participants.map(p => p.user.name).join(', '))
				.toLowerCase()
				.includes(search.toLowerCase())
		)
	}

	const filteredChats = filterChats(chats, search)

	const getDetails = (chat: Chat) => {
		const lastMessage = chat.messages[0]
		if (lastMessage) {
			return lastMessage.content.length > 50
				? lastMessage.content.substring(0, 50) + '...'
				: lastMessage.content
		}
		return 'Нет сообщений'
	}

	const lastActivity = (chat: Chat) => chat.messages[0]?.createdAt

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<Box>
			<Box display='flex' alignItems='center' gap='10px' p={3}>
				<Badge
					variant='dot'
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					overlap='circular'
					color='success'
				>
					<Avatar
						alt='User'
						src='/images/profile/user-1.jpg'
						sx={{ width: 54, height: 54 }}
					/>
				</Badge>
				<Box>
					<Typography variant='body1' fontWeight={600}>
						Current User
					</Typography>
					<Typography variant='body2'>Online</Typography>
				</Box>
			</Box>
			<Box px={3} py={1}>
				<TextField
					id='outlined-search'
					placeholder='Поиск чатов'
					size='small'
					type='search'
					variant='outlined'
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconSearch size='16' />
							</InputAdornment>
						),
					}}
					fullWidth
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</Box>
			<List sx={{ px: 0 }}>
				<Box px={2.5} pb={1}>
					<Button
						id='basic-button'
						aria-controls={open ? 'basic-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
						color='inherit'
					>
						Недавние чаты <IconChevronDown size='16' />
					</Button>
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{ 'aria-labelledby': 'basic-button' }}
					>
						<MenuItem onClick={handleClose}>Сортировать по времени</MenuItem>
						<MenuItem onClick={handleClose}>
							Сортировать по непрочитанным
						</MenuItem>
						<MenuItem onClick={handleClose}>
							Отметить все как прочитанные
						</MenuItem>
					</Menu>
				</Box>
				<Scrollbar
					sx={{
						height: { lg: 'calc(100vh - 100px)', md: '100vh' },
						maxHeight: '600px',
					}}
				>
					{loading ? (
						<Box sx={{ textAlign: 'center', py: 4 }}>
							<CircularProgress />
						</Box>
					) : error ? (
						<Box m={2}>
							<Alert severity='error' variant='filled' sx={{ color: 'white' }}>
								{error}
							</Alert>
						</Box>
					) : filteredChats.length ? (
						filteredChats.map(chat => (
							<ListItemButton
								key={chat.id}
								onClick={() =>
									dispatch({ type: 'SelectChat', payload: chat.id })
								}
								sx={{ mb: 0.5, py: 2, px: 3, alignItems: 'start' }}
								selected={
									useSelector(state => state.chatReducer.chatContent) ===
									chat.id
								}
							>
								<ListItemAvatar>
									<Badge
										color='success'
										variant='dot'
										anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
										overlap='circular'
									>
										<Avatar
											alt={chat.name || chat.participants[0]?.user.name}
											src={
												chat.participants[0]?.user.avatar ||
												'/images/profile/user-1.jpg'
											}
											sx={{ width: 42, height: 42 }}
										/>
									</Badge>
								</ListItemAvatar>
								<ListItemText
									primary={
										<Typography variant='subtitle2' fontWeight={600} mb={0.5}>
											{chat.name ||
												chat.participants.map(p => p.user.name).join(', ')}
										</Typography>
									}
									secondary={
										<>
											{getDetails(chat)}
											{chat.deal && (
												<Typography
													component='span'
													variant='caption'
													sx={{ display: 'block' }}
												>
													Сделка: {chat.deal.title}
												</Typography>
											)}
											{chat.account && (
												<Typography
													component='span'
													variant='caption'
													sx={{ display: 'block' }}
												>
													Компания: {chat.account.name}
												</Typography>
											)}
										</>
									}
									secondaryTypographyProps={{ noWrap: true }}
									sx={{ my: 0 }}
								/>
								<Box sx={{ flexShrink: 0 }} mt={0.5}>
									<Typography variant='body2'>
										{lastActivity(chat)
											? formatDistanceToNowStrict(
													new Date(lastActivity(chat)),
													{ addSuffix: false }
											  )
											: ''}
									</Typography>
								</Box>
							</ListItemButton>
						))
					) : (
						<Box m={2}>
							<Alert severity='info' variant='filled' sx={{ color: 'white' }}>
								Чаты не найдены
							</Alert>
						</Box>
					)}
				</Scrollbar>
			</List>
		</Box>
	)
}

export default ChatListing
