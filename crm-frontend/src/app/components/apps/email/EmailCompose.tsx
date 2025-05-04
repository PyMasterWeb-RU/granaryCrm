'use client'

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel'
import { useSelector } from '@/store/hooks'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import { TransitionProps } from '@mui/material/transitions'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & { children: React.ReactElement },
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />
})

export default function EmailCompose() {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({
		to: '',
		subject: '',
		content: '',
		templateId: '',
		attachments: [] as File[],
	})

	const user = useSelector(state => state.auth.user)
	const templates = useSelector(state => state.emailReducer.templates || [])

	const handleClickOpen = () => setOpen(true)
	const handleClose = () => {
		setOpen(false)
		setForm({
			to: '',
			subject: '',
			content: '',
			templateId: '',
			attachments: [],
		})
	}

	const handleSubmit = async () => {
		try {
			if (!user) {
				throw new Error('Пользователь не авторизован')
			}
			const formData = new FormData()
			formData.append('to', form.to)
			formData.append('subject', form.subject)
			formData.append('content', form.content)
			if (form.templateId) formData.append('templateId', form.templateId)
			form.attachments.forEach(file => formData.append('attachments', file))

			await axios.post('/api/email/send-with-files', formData, {
				withCredentials: true,
				headers: { 'Content-Type': 'multipart/form-data' },
			})

			toast.success('Письмо отправлено')
			handleClose()
		} catch (err) {
			console.error(err)
			toast.error('Ошибка при отправке письма')
		}
	}

	return (
		<Box>
			<Box p={3} pb={1}>
				<Button
					variant='contained'
					fullWidth
					color='primary'
					onClick={handleClickOpen}
				>
					Написать
				</Button>
			</Box>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				fullWidth
				maxWidth='md'
			>
				<DialogTitle variant='h5'>Новое письмо</DialogTitle>
				<DialogContent>
					<CustomFormLabel htmlFor='to-text'>Кому</CustomFormLabel>
					<TextField
						id='to-text'
						fullWidth
						size='small'
						variant='outlined'
						value={form.to}
						onChange={e => setForm({ ...form, to: e.target.value })}
					/>

					<CustomFormLabel htmlFor='subject-text'>Тема</CustomFormLabel>
					<TextField
						id='subject-text'
						fullWidth
						size='small'
						variant='outlined'
						value={form.subject}
						onChange={e => setForm({ ...form, subject: e.target.value })}
					/>

					<CustomFormLabel htmlFor='template-select'>Шаблон</CustomFormLabel>
					<TextField
						id='template-select'
						select
						fullWidth
						size='small'
						variant='outlined'
						value={form.templateId}
						onChange={e => setForm({ ...form, templateId: e.target.value })}
					>
						<MenuItem value=''>Без шаблона</MenuItem>
						{templates.map((tpl: any) => (
							<MenuItem key={tpl.id} value={tpl.id}>
								{tpl.name}
							</MenuItem>
						))}
					</TextField>

					<CustomFormLabel htmlFor='message-text'>Сообщение</CustomFormLabel>
					<TextField
						id='message-text'
						placeholder='Напишите сообщение'
						multiline
						fullWidth
						rows={6}
						variant='outlined'
						value={form.content}
						onChange={e => setForm({ ...form, content: e.target.value })}
					/>

					<CustomFormLabel htmlFor='upload-text'>Вложения</CustomFormLabel>
					<Box>
						<input
							type='file'
							multiple
							id='upload-text'
							style={{ width: '100%', padding: 8 }}
							onChange={e =>
								setForm({
									...form,
									attachments: Array.from(e.target.files || []),
								})
							}
						/>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleSubmit} color='primary' variant='contained'>
						Отправить
					</Button>
					<Button onClick={handleClose} color='secondary'>
						Отмена
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}
