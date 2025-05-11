'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import { SetReplyTo } from '@/store/apps/chat/ChatSlice'
import { useDispatch, useSelector } from '@/store/hooks'
import { Chat } from '@/types/chat'
import { Button, CircularProgress } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
	IconDotsVertical,
	IconMenu2,
	IconPhone,
	IconVideo,
} from '@tabler/icons-react'
import { formatDistanceToNowStrict } from 'date-fns'
import MarkdownIt from 'markdown-it'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import ChatInsideSidebar from './ChatInsideSidebar'

const md = new MarkdownIt()

interface ChatContentProps {
	toggleChatSidebar: () => void
}

const ChatContent: React.FC<ChatContentProps> = ({ toggleChatSidebar }) => {
	const [open, setOpen] = useState(true)
	const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
	const dispatch = useDispatch()
	const activeChatId = useSelector(state => state.chatReducer.chatContent)
	const currentUserId = useSelector(
		state => state.auth?.user?.id || 'current_user_id'
	) // Предполагается, что user хранится в auth
	const [chatDetails, setChatDetails] = useState<Chat | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!activeChatId) return

		const fetchChatDetails = async () => {
			setLoading(true)
			try {
				// Получаем данные чата, включая сообщения и участников
				const res = await axiosWithAuth.get(`/chats/${activeChatId}`, {
					params: { includeMessages: true, includeParticipants: true },
				})
				setChatDetails({
					id: res.data.id,
					name: res.data.name,
					type: res.data.type,
					status: 'Online', // Можно обновить на основе данных API
					thumb:
						res.data.participants?.[0]?.user?.avatar ||
						'/images/profile/user-1.jpg',
					messages: res.data.messages?.reverse() || [], // Отображаем сообщения снизу вверх
					participants: res.data.participants || [],
					deal: res.data.deal,
					account: res.data.account,
				})
				setError(null)
			} catch (err) {
				setError('Не удалось загрузить чат')
			} finally {
				setLoading(false)
			}
		}
		fetchChatDetails()
	}, [activeChatId])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [chatDetails?.messages])

	return (
		<Box>
			{chatDetails ? (
				<Box>
					{/* Header Part */}
					<Box>
						<Box display='flex' alignItems='center' p={2}>
							<Box
								sx={{
									display: { xs: 'block', md: 'block', lg: 'none' },
									mr: '10px',
								}}
							>
								<IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
							</Box>
							<ListItem dense disableGutters>
								<ListItemAvatar>
									<Badge
										color='success'
										variant='dot'
										anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
										overlap='circular'
									>
										<Avatar
											alt={chatDetails.name || 'Chat'}
											src={chatDetails.thumb || '/images/profile/user-1.jpg'}
											sx={{ width: 40, height: 40 }}
										/>
									</Badge>
								</ListItemAvatar>
								<ListItemText
									primary={
										<Typography variant='h5'>
											{chatDetails.name || 'Чат'}
										</Typography>
									}
									secondary={chatDetails.status || 'Online'}
								/>
							</ListItem>
							<Stack direction='row'>
								<IconButton aria-label='phone'>
									<IconPhone stroke={1.5} />
								</IconButton>
								<IconButton aria-label='video'>
									<IconVideo stroke={1.5} />
								</IconButton>
								<IconButton aria-label='sidebar' onClick={() => setOpen(!open)}>
									<IconDotsVertical stroke={1.5} />
								</IconButton>
							</Stack>
						</Box>
						<Divider />
					</Box>
					{/* Chat Content */}
					<Box display='flex'>
						{/* Chat messages */}
						<Box width='100%'>
							<Box
								sx={{ height: '650px', overflow: 'auto', maxHeight: '800px' }}
							>
								<Box p={3}>
									{loading ? (
										<Box sx={{ textAlign: 'center', py: 4 }}>
											<CircularProgress />
										</Box>
									) : error ? (
										<Typography color='error'>{error}</Typography>
									) : (
										chatDetails.messages.map(chat => (
											<Box key={chat.id} mb={2}>
												{chat.sender.id !== currentUserId ? (
													<Box display='flex'>
														<ListItemAvatar>
															<Avatar
																alt={chat.sender.name}
																src={
																	chat.sender.avatar ||
																	'/images/profile/user-1.jpg'
																}
																sx={{ width: 40, height: 40 }}
															/>
														</ListItemAvatar>
														<Box>
															<Typography
																variant='body2'
																color='grey.400'
																mb={1}
															>
																{chat.sender.name},{' '}
																{formatDistanceToNowStrict(
																	new Date(chat.createdAt),
																	{
																		addSuffix: false,
																	}
																)}{' '}
																ago
															</Typography>
															{chat.replyTo && (
																<Box
																	sx={{
																		bgcolor: 'grey.200',
																		p: 1,
																		mb: 1,
																		borderRadius: 1,
																		fontStyle: 'italic',
																	}}
																>
																	<Typography variant='caption'>
																		Ответ на: {chat.replyTo.sender.name}
																	</Typography>
																	<Typography variant='body2'>
																		{chat.replyTo.content}
																	</Typography>
																</Box>
															)}
															{chat.type === 'text' ? (
																<Box
																	mb={2}
																	sx={{
																		p: 1,
																		backgroundColor: 'grey.100',
																		mr: 'auto',
																		maxWidth: '320px',
																	}}
																	dangerouslySetInnerHTML={{
																		__html: md.render(chat.content),
																	}}
																/>
															) : chat.files.some(file =>
																	file.mimeType.startsWith('image/')
															  ) ? (
																<Box
																	mb={1}
																	sx={{ overflow: 'hidden', lineHeight: '0px' }}
																>
																	<Image
																		src={
																			chat.files.find(file =>
																				file.mimeType.startsWith('image/')
																			)!.path
																		}
																		alt='attach'
																		width={150}
																		height={150}
																	/>
																</Box>
															) : null}
															<Button
																size='small'
																onClick={() => dispatch(SetReplyTo(chat))}
															>
																Ответить
															</Button>
														</Box>
													</Box>
												) : (
													<Box
														mb={1}
														display='flex'
														alignItems='flex-end'
														flexDirection='row-reverse'
													>
														<Box
															alignItems='flex-end'
															display='flex'
															flexDirection='column'
														>
															<Typography
																variant='body2'
																color='grey.400'
																mb={1}
															>
																{formatDistanceToNowStrict(
																	new Date(chat.createdAt),
																	{
																		addSuffix: false,
																	}
																)}{' '}
																ago
															</Typography>
															{chat.replyTo && (
																<Box
																	sx={{
																		bgcolor: 'grey.200',
																		p: 1,
																		mb: 1,
																		borderRadius: 1,
																		fontStyle: 'italic',
																	}}
																>
																	<Typography variant='caption'>
																		Ответ на: {chat.replyTo.sender.name}
																	</Typography>
																	<Typography variant='body2'>
																		{chat.replyTo.content}
																	</Typography>
																</Box>
															)}
															{chat.type === 'text' ? (
																<Box
																	mb={1}
																	sx={{
																		p: 1,
																		backgroundColor: 'primary.light',
																		ml: 'auto',
																		maxWidth: '320px',
																	}}
																	dangerouslySetInnerHTML={{
																		__html: md.render(chat.content),
																	}}
																/>
															) : chat.files.some(file =>
																	file.mimeType.startsWith('image/')
															  ) ? (
																<Box
																	mb={1}
																	sx={{ overflow: 'hidden', lineHeight: '0px' }}
																>
																	<Image
																		src={
																			chat.files.find(file =>
																				file.mimeType.startsWith('image/')
																			)!.path
																		}
																		alt='attach'
																		width={250}
																		height={165}
																	/>
																</Box>
															) : null}
															<Button
																size='small'
																onClick={() => dispatch(SetReplyTo(chat))}
															>
																Ответить
															</Button>
														</Box>
													</Box>
												)}
											</Box>
										))
									)}
									<div ref={messagesEndRef} />
								</Box>
							</Box>
						</Box>
						{/* Chat right sidebar Content */}
						{open && (
							<Box flexShrink={0}>
								<ChatInsideSidebar
									isInSidebar={lgUp ? open : !open}
									chat={chatDetails}
								/>
							</Box>
						)}
					</Box>
				</Box>
			) : (
				<Box display='flex' alignItems='center' p={2} pb={1} pt={1}>
					<Box
						sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' }, mr: '10px' }}
					>
						<IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
					</Box>
					<Typography variant='h4'>Выберите чат</Typography>
				</Box>
			)}
		</Box>
	)
}

export default ChatContent
