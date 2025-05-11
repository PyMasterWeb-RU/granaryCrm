'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import { useDispatch, useSelector } from '@/store/hooks'
import { Message } from '@/types/chat'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Typography from '@mui/material/Typography'
import { IconPaperclip, IconSend } from '@tabler/icons-react'
import React, { useState } from 'react'

const ChatMsgSent = () => {
	const [msg, setMsg] = useState('')
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const dispatch = useDispatch()
	const activeChatId = useSelector(state => state.chatReducer.chatContent)
	const replyTo = useSelector(
		state => state.chatReducer.replyTo
	) as Message | null

	const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMsg(e.target.value)
	}

	const handleEmojiSelect = (emoji: any) => {
		console.log('Selected emoji:', emoji)
		setMsg(msg + emoji.native)
		setShowEmojiPicker(false)
	}

	const onChatMsgSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!msg.trim() || !activeChatId) return

		try {
			setError(null)
			const res = await axiosWithAuth.post(`/chats/${activeChatId}/messages`, {
				content: msg,
				replyToId: replyTo?.id,
			})
			dispatch({ type: 'ADD_MESSAGE', payload: res.data })
			setMsg('')
			dispatch({ type: 'SET_REPLY_TO', payload: null })
		} catch (err: any) {
			setError('Не удалось отправить сообщение')
			console.error('Ошибка отправки сообщения:', err)
		}
	}

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (!file || !activeChatId) return

		try {
			setError(null)
			const formData = new FormData()
			formData.append('file', file)
			const res = await axiosWithAuth.post('/files/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			await axiosWithAuth.post(`/chats/${activeChatId}/messages`, {
				content: `Отправлен файл: ${res.data.name}`,
				fileIds: [res.data.id],
			})
		} catch (err: any) {
			setError('Не удалось загрузить файл')
			console.error('Ошибка загрузки файла:', err)
		}
	}

	return (
		<Box p={2}>
			{error && (
				<Typography color='error' sx={{ mb: 1 }}>
					{error}
				</Typography>
			)}
			<form
				onSubmit={onChatMsgSubmit}
				style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
			>
				{replyTo && (
					<Box
						sx={{
							bgcolor: 'grey.200',
							p: 1,
							mb: 1,
							borderRadius: 1,
							width: '100%',
						}}
					>
						<Typography variant='caption'>
							Отвечаете на: {replyTo.sender.name}
						</Typography>
						<Typography variant='body2'>{replyTo.content}</Typography>
						<Button
							size='small'
							onClick={() => dispatch({ type: 'SET_REPLY_TO', payload: null })}
						>
							Отменить
						</Button>
					</Box>
				)}
				<InputBase
					id='msg-sent'
					fullWidth
					value={msg}
					placeholder='Напишите сообщение...'
					size='small'
					type='text'
					inputProps={{ 'aria-label': 'Type a Message' }}
					onChange={handleChatMsgChange}
				/>
				<IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
					<EmojiEmotionsIcon />
				</IconButton>
				<IconButton component='label'>
					<IconPaperclip stroke={1.5} size='20' />
					<input type='file' hidden onChange={handleFileUpload} />
				</IconButton>
				<IconButton type='submit' disabled={!msg.trim()}>
					<IconSend stroke={1.5} size='20' />
				</IconButton>
			</form>
			{showEmojiPicker && (
				<Box sx={{ position: 'absolute', bottom: 80, right: 20 }}>
					<Picker data={data} onEmojiSelect={handleEmojiSelect} />
				</Box>
			)}
		</Box>
	)
}

export default ChatMsgSent
