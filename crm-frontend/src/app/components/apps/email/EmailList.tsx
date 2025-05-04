// src/app/components/apps/email/EmailContent.tsx
'use client'

import { deleteEmail, updateEmail } from '@/store/apps/email/EmailSlice'
import { useDispatch, useSelector } from '@/store/hooks'
import {
	Avatar,
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	IconButton,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconFlag, IconStar, IconTrash } from '@tabler/icons-react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'

const ReactQuill: any = dynamic(
	async () => {
		const { default: RQ } = await import('react-quill')
		return (props: any) => <RQ {...props} />
	},
	{ ssr: false }
)

export default function EmailContent() {
	const dispatch = useDispatch()
	const theme = useTheme()

	const user = useSelector(state => state.auth.user)
	const emailDetails = useSelector(state => state.emailReducer.selectedEmail)
	const [showReply, setShowReply] = useState(false)
	const [replyText, setReplyText] = useState('')

	const axiosOpts = { withCredentials: true }

	const handleReply = async () => {
		try {
			if (!user) throw new Error('Пользователь не авторизован')
			if (!emailDetails?.id) throw new Error('Письмо не выбрано')

			await axios.post(
				`/api/email/reply/${emailDetails.id}`,
				{ body: replyText },
				axiosOpts
			)

			toast.success('Ответ отправлен')
			setShowReply(false)
			setReplyText('')
		} catch {
			toast.error('Ошибка при отправке ответа')
		}
	}

	const handleForward = async () => {
		try {
			if (!user) throw new Error('Пользователь не авторизован')
			if (!emailDetails?.id) throw new Error('Письмо не выбрано')

			const to = prompt('Введите адрес получателя:')
			if (!to) return

			await axios.post(
				`/api/email/forward/${emailDetails.id}`,
				{ to },
				axiosOpts
			)

			toast.success('Письмо переслано')
		} catch {
			toast.error('Ошибка при пересылке письма')
		}
	}

	const handleToggleStar = async () => {
		try {
			if (!user) throw new Error('Пользователь не авторизован')
			if (!emailDetails?.id) throw new Error('Письмо не выбрано')

			const newFlagged = !emailDetails.flagged
			await axios.patch(
				`/api/inbox/${emailDetails.id}`,
				{ flagged: newFlagged },
				axiosOpts
			)

			dispatch(updateEmail({ id: emailDetails.id, flagged: newFlagged }))
		} catch {
			toast.error('Ошибка при обновлении статуса')
		}
	}

	const handleToggleSeen = async () => {
		try {
			if (!user) throw new Error('Пользователь не авторизован')
			if (!emailDetails?.id) throw new Error('Письмо не выбрано')

			const newSeen = !emailDetails.seen
			await axios.patch(
				`/api/inbox/${emailDetails.id}`,
				{ seen: newSeen },
				axiosOpts
			)

			dispatch(updateEmail({ id: emailDetails.id, seen: newSeen }))
		} catch {
			toast.error('Ошибка при обновлении статуса')
		}
	}

	const handleDelete = async () => {
		try {
			if (!user) throw new Error('Пользователь не авторизован')
			if (!emailDetails?.id) throw new Error('Письмо не выбрано')

			await axios.patch(
				`/api/inbox/${emailDetails.id}`,
				{ folder: 'trash' },
				axiosOpts
			)

			dispatch(deleteEmail(emailDetails.id))
			toast.success('Письмо перемещено в корзину')
		} catch {
			toast.error('Ошибка при удалении письма')
		}
	}

	if (!emailDetails) {
		return (
			<Box
				p={3}
				height='50vh'
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Box textAlign='center'>
					<Typography variant='h4'>Выберите письмо</Typography>
					<Image
						src='/images/breadcrumb/emailSv.png'
						alt='emailIcon'
						width={250}
						height={250}
					/>
				</Box>
			</Box>
		)
	}

	// Работаем с attachments через default-пустой массив
	const attachments = emailDetails.attachments ?? []

	return (
		<Box>
			<Stack p={2} direction='row' spacing={1}>
				<IconButton onClick={handleToggleStar}>
					<IconStar
						stroke={1.3}
						size={18}
						style={{
							fill: emailDetails.flagged
								? theme.palette.warning.main
								: undefined,
							stroke: emailDetails.flagged
								? theme.palette.warning.main
								: undefined,
						}}
					/>
				</IconButton>
				<IconButton onClick={handleToggleSeen}>
					<IconFlag
						size={18}
						stroke={1.3}
						style={{
							fill: emailDetails.seen ? theme.palette.error.light : undefined,
						}}
					/>
				</IconButton>
				<IconButton onClick={handleDelete}>
					<IconTrash size={18} stroke={1.3} />
				</IconButton>
			</Stack>

			<Divider />

			<Box p={3}>
				<Stack direction='row' alignItems='center' spacing={2} mb={3}>
					<Avatar
						alt={emailDetails.from}
						src={emailDetails.thumbnail || '/images/avatars/default.png'}
						sx={{ width: 40, height: 40 }}
					/>
					<Box>
						<Typography variant='h6'>{emailDetails.from}</Typography>
						<Typography variant='body2'>Кому: {emailDetails.to}</Typography>
					</Box>
					<Chip
						label={emailDetails.folder}
						size='small'
						sx={{ ml: 'auto', height: 21 }}
						color={
							emailDetails.folder === 'inbox'
								? 'primary'
								: emailDetails.folder === 'sent'
								? 'success'
								: emailDetails.folder === 'spam'
								? 'error'
								: 'warning'
						}
					/>
				</Stack>

				<Typography variant='h4' gutterBottom>
					{emailDetails.subject}
				</Typography>

				<Box mb={3}>
					<div
						dangerouslySetInnerHTML={{
							__html: emailDetails.html || emailDetails.text || '',
						}}
					/>
				</Box>
			</Box>

			{attachments.length > 0 && (
				<>
					<Divider />
					<Box p={3}>
						<Typography variant='h6'>
							Вложения ({attachments.length})
						</Typography>
						<Grid container spacing={3} mt={1}>
							{attachments.map((attach: any) => (
								<Grid size={4} key={attach.filename}>
									<Stack direction='row' spacing={2} alignItems='center'>
										<Avatar
											variant='rounded'
											sx={{
												width: 48,
												height: 48,
												bgcolor: theme.palette.grey[100],
											}}
										>
											<Avatar
												src={`/api/inbox/${emailDetails.id}/attachments/${attach.filename}`}
												alt='attachment'
												variant='rounded'
												sx={{ width: 24, height: 24 }}
											/>
										</Avatar>
										<Box flex='1'>
											<Typography variant='subtitle2' fontWeight={600}>
												{attach.filename}
											</Typography>
											<Typography variant='body2'>
												{(attach.size / 1024).toFixed(2)} KB
											</Typography>
										</Box>
									</Stack>
								</Grid>
							))}
						</Grid>
					</Box>
					<Divider />
				</>
			)}

			<Box p={3}>
				<Stack direction='row' spacing={2}>
					<Button
						variant='outlined'
						size='small'
						color='primary'
						onClick={() => setShowReply(true)}
					>
						Ответить
					</Button>
					<Button variant='outlined' size='small' onClick={handleForward}>
						Переслать
					</Button>
				</Stack>

				{showReply && (
					<Box mt={3}>
						<Paper variant='outlined'>
							<ReactQuill
								value={replyText}
								onChange={setReplyText}
								placeholder='Напишите ответ...'
							/>
							<Box p={2} textAlign='right'>
								<Button
									onClick={handleReply}
									color='primary'
									variant='contained'
								>
									Отправить
								</Button>
							</Box>
						</Paper>
					</Box>
				)}
			</Box>
		</Box>
	)
}
