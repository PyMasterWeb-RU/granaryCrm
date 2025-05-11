'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import type { Contact } from '@/types/company'
import type { Deal } from '@/types/deal'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Activity {
	id: string
	action: string
	createdAt: string
	user: { email: string }
}

interface Document {
	id: string
	name: string
	path: string
	createdAt: string
}

interface Message {
	id: string
	content: string
	sender: string
	createdAt: string
}

interface DealTabsProps {
	initialDeal: Deal
}

export default function DealTabs({ initialDeal }: DealTabsProps) {
	const [tab, setTab] = useState<
		'info' | 'contacts' | 'documents' | 'messages' | 'activity' | 'files'
	>('info')
	const handleChange = (_: React.SyntheticEvent, newValue: typeof tab) => {
		setTab(newValue)
	}

	const router = useRouter()

	// --- состояние контактов ---
	const [contacts, setContacts] = useState<Contact[]>([])
	const [loadingContacts, setLoadingContacts] = useState(true)
	const [errorContacts, setErrorContacts] = useState<string | null>(null)

	useEffect(() => {
		if (tab !== 'contacts' || !initialDeal.accountId) return

		setLoadingContacts(true)
		axiosWithAuth
			.get<Contact[]>(`/contacts?accountId=${initialDeal.accountId}`)
			.then(res => {
				console.log('Контакты:', res.data)
				setContacts(res.data)
				setErrorContacts(null)
			})
			.catch(err => {
				console.error('Ошибка загрузки контактов:', err)
				setErrorContacts('Не удалось загрузить контакты')
			})
			.finally(() => {
				setLoadingContacts(false)
			})
	}, [tab, initialDeal.accountId])

	// --- состояние документов ---
	const [documents, setDocuments] = useState<Document[]>([])
	const [loadingDocuments, setLoadingDocuments] = useState(true)
	const [errorDocuments, setErrorDocuments] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)

	useEffect(() => {
		if (tab !== 'documents') return

		setLoadingDocuments(true)
		axiosWithAuth
			.get<Document[]>(`/files?dealId=${initialDeal.id}`)
			.then(res => {
				console.log('Документы:', res.data)
				setDocuments(res.data)
				setErrorDocuments(null)
			})
			.catch(err => {
				console.error('Ошибка загрузки документов:', err)
				setErrorDocuments('Не удалось загрузить документы')
			})
			.finally(() => {
				setLoadingDocuments(false)
			})
	}, [tab, initialDeal.id])

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (!file) return

		setUploading(true)
		try {
			const formData = new FormData()
			formData.append('file', file)
			formData.append('dealId', initialDeal.id)
			if (initialDeal.accountId) {
				formData.append('accountId', initialDeal.accountId)
			}

			const res = await axiosWithAuth.post<Document>(
				'/files/upload',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			)
			setDocuments([...documents, res.data])
			setErrorDocuments(null)
		} catch (err) {
			console.error('Ошибка загрузки документа:', err)
			setErrorDocuments('Не удалось загрузить документ')
		} finally {
			setUploading(false)
		}
	}

	// --- состояние переписки ---
	const [messages, setMessages] = useState<Message[]>([])
	const [loadingMessages, setLoadingMessages] = useState(true)
	const [errorMessages, setErrorMessages] = useState<string | null>(null)
	const [newMessage, setNewMessage] = useState('')

	useEffect(() => {
		if (tab !== 'messages' || !initialDeal.contactId) return

		setLoadingMessages(true)
		axiosWithAuth
			.get<Message[]>(`/messages?contactId=${initialDeal.contactId}`)
			.then(res => {
				console.log('Переписка:', res.data)
				setMessages(res.data)
				setErrorMessages(null)
			})
			.catch(err => {
				console.error('Ошибка загрузки переписки:', err)
				setErrorMessages('Не удалось загрузить переписку')
			})
			.finally(() => {
				setLoadingMessages(false)
			})
	}, [tab, initialDeal.contactId])

	const handleSendMessage = async () => {
		if (!newMessage.trim() || !initialDeal.contactId) return

		try {
			const res = await axiosWithAuth.post<Message>('/messages', {
				content: newMessage,
				contactId: initialDeal.contactId,
				dealId: initialDeal.id,
			})
			setMessages([...messages, res.data])
			setNewMessage('')
		} catch (err) {
			console.error('Ошибка отправки сообщения:', err)
			setErrorMessages('Не удалось отправить сообщение')
		}
	}

	// --- состояние активности ---
	const [activities, setActivities] = useState<Activity[]>([])
	const [loadingActivities, setLoadingActivities] = useState(true)
	const [errorActivities, setErrorActivities] = useState<string | null>(null)

	useEffect(() => {
		if (tab !== 'activity') return

		setLoadingActivities(true)
		axiosWithAuth
			.get<Activity[]>(`/activities?dealId=${initialDeal.id}`)
			.then(res => {
				console.log('Активности:', res.data)
				setActivities(res.data)
				setErrorActivities(null)
			})
			.catch(err => {
				console.error('Ошибка загрузки активностей:', err)
				setErrorActivities('Не удалось загрузить активности')
			})
			.finally(() => {
				setLoadingActivities(false)
			})
	}, [tab, initialDeal.id])

	// --- состояние файлов ---
	const [files, setFiles] = useState<Document[]>([])
	const [loadingFiles, setLoadingFiles] = useState(true)
	const [errorFiles, setErrorFiles] = useState<string | null>(null)

	useEffect(() => {
		if (tab !== 'files') return

		setLoadingFiles(true)
		axiosWithAuth
			.get<Document[]>(`/files?dealId=${initialDeal.id}`)
			.then(res => {
				console.log('Файлы:', res.data)
				setFiles(res.data)
				setErrorFiles(null)
			})
			.catch(err => {
				console.error('Ошибка загрузки файлов:', err)
				setErrorFiles('Не удалось загрузить файлы')
			})
			.finally(() => {
				setLoadingFiles(false)
			})
	}, [tab, initialDeal.id])

	return (
		<Box>
			<Tabs
				value={tab}
				onChange={handleChange}
				aria-label='Deal tabs'
				variant='scrollable'
				scrollButtons='auto'
				sx={{ mb: 2 }}
			>
				<Tab label='Информация' value='info' />
				<Tab label='Контакты' value='contacts' />
				<Tab label='Документы' value='documents' />
				<Tab label='Переписка' value='messages' />
				<Tab label='Активность' value='activity' />
				<Tab label='Файлы' value='files' />
			</Tabs>

			<Paper variant='outlined' sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
				{tab === 'info' && (
					<Grid container spacing={4}>
						{/* Основная информация */}
						<Grid size={{ xs: 12 }}>
							<Typography variant='h6' gutterBottom>
								Основная информация
							</Typography>
							<Divider />
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Название
								</Typography>
								<Typography variant='body1' fontWeight={500}>
									{initialDeal.title}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Сумма
								</Typography>
								<Typography variant='body1'>
									{initialDeal.amount.toLocaleString()}{' '}
									{initialDeal.currency || 'RUB'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Этап
								</Typography>
								<Typography variant='body1'>{initialDeal.stage}</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Вероятность
								</Typography>
								<Typography variant='body1'>
									{initialDeal.probability}%
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Дата закрытия
								</Typography>
								<Typography variant='body1'>
									{new Date(initialDeal.closeDate).toLocaleDateString()}
								</Typography>
							</Box>
						</Grid>

						{/* Параметры сделки */}
						<Grid size={{ xs: 12 }}>
							<Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
								Параметры сделки
							</Typography>
							<Divider />
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Тип сделки
								</Typography>
								<Typography variant='body1'>
									{initialDeal.dealType || '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Номенклатура
								</Typography>
								<Typography variant='body1'>
									{initialDeal.nomenclature || '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Фасовка
								</Typography>
								<Typography variant='body1'>
									{initialDeal.packaging || '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Вид доставки
								</Typography>
								<Typography variant='body1'>
									{initialDeal.deliveryType || '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Транспорт
								</Typography>
								<Typography variant='body1'>
									{initialDeal.transport || '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Валюта
								</Typography>
								<Typography variant='body1'>
									{initialDeal.currency || '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Цена
								</Typography>
								<Typography variant='body1'>
									{initialDeal.price ? initialDeal.price.toLocaleString() : '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Курс ЦБ
								</Typography>
								<Typography variant='body1'>
									{initialDeal.cbRate ? initialDeal.cbRate.toFixed(4) : '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Итоговая стоимость (RUB)
								</Typography>
								<Typography variant='body1'>
									{initialDeal.price && initialDeal.cbRate
										? (initialDeal.price * initialDeal.cbRate).toLocaleString()
										: '—'}
								</Typography>
							</Box>
						</Grid>

						{/* Клиент и контакт */}
						<Grid size={{ xs: 12 }}>
							<Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
								Клиент и контакт
							</Typography>
							<Divider />
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Клиент
								</Typography>
								<Typography variant='body1'>
									{initialDeal.account?.name || '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Контакт
								</Typography>
								<Typography variant='body1'>
									{initialDeal.contact
										? `${initialDeal.contact.firstName} ${initialDeal.contact.lastName}`
										: '—'}
								</Typography>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
							<Box sx={{ mb: 2 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Владелец
								</Typography>
								<Typography variant='body1'>
									{initialDeal.owner?.email || '—'}
								</Typography>
							</Box>
						</Grid>
					</Grid>
				)}

				{tab === 'contacts' && (
					<Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 2,
							}}
						>
							<Typography variant='h6'>Контакты клиента</Typography>
							{initialDeal.accountId && (
								<Button
									variant='contained'
									color='primary'
									onClick={() =>
										router.push(
											`/apps/contacts/create?accountId=${initialDeal.accountId}`
										)
									}
								>
									Добавить контакт
								</Button>
							)}
						</Box>

						{loadingContacts && (
							<Box sx={{ textAlign: 'center', py: 4 }}>
								<CircularProgress />
							</Box>
						)}

						{errorContacts && (
							<Alert severity='error' sx={{ mb: 2 }}>
								{errorContacts}
							</Alert>
						)}

						{!loadingContacts && !errorContacts && (
							<>
								{contacts.length > 0 ? (
									<TableContainer
										component={Paper}
										sx={{ borderRadius: 2, boxShadow: 1 }}
									>
										<Table size='small'>
											<TableHead>
												<TableRow>
													<TableCell>
														<strong>Имя</strong>
													</TableCell>
													<TableCell>
														<strong>Email</strong>
													</TableCell>
													<TableCell>
														<strong>Телефон</strong>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{contacts.map(c => (
													<TableRow
														key={c.id}
														hover
														sx={{ cursor: 'pointer' }}
														onClick={() =>
															router.push(`/apps/contacts/${c.id}`)
														}
													>
														<TableCell>{`${c.firstName} ${c.lastName}`}</TableCell>
														<TableCell>{c.email || '—'}</TableCell>
														<TableCell>{c.phone || '—'}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Typography>Контактов не добавлено</Typography>
								)}
							</>
						)}
					</Box>
				)}

				{tab === 'documents' && (
					<Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 2,
							}}
						>
							<Typography variant='h6'>Документы сделки</Typography>
							<Button
								variant='contained'
								color='primary'
								component='label'
								disabled={uploading}
							>
								{uploading ? 'Загрузка...' : 'Загрузить документ'}
								<input
									type='file'
									hidden
									onChange={handleFileUpload}
									disabled={uploading}
								/>
							</Button>
						</Box>

						{loadingDocuments && (
							<Box sx={{ textAlign: 'center', py: 4 }}>
								<CircularProgress />
							</Box>
						)}

						{errorDocuments && (
							<Alert severity='error' sx={{ mb: 2 }}>
								{errorDocuments}
							</Alert>
						)}

						{!loadingDocuments && !errorDocuments && (
							<>
								{documents.length > 0 ? (
									<TableContainer
										component={Paper}
										sx={{ borderRadius: 2, boxShadow: 1 }}
									>
										<Table size='small'>
											<TableHead>
												<TableRow>
													<TableCell>
														<strong>Название</strong>
													</TableCell>
													<TableCell>
														<strong>Дата загрузки</strong>
													</TableCell>
													<TableCell>
														<strong>Ссылка</strong>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{documents.map(doc => (
													<TableRow key={doc.id}>
														<TableCell>{doc.name}</TableCell>
														<TableCell>
															{new Date(doc.createdAt).toLocaleDateString()}
														</TableCell>
														<TableCell>
															<a
																href={`/files/download/${doc.id}`}
																target='_blank'
																rel='noopener noreferrer'
															>
																Скачать
															</a>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Typography>Документов не добавлено</Typography>
								)}
							</>
						)}
					</Box>
				)}

				{tab === 'messages' && (
					<Box>
						<Typography variant='h6' gutterBottom>
							Переписка с контактом
						</Typography>

						{loadingMessages && (
							<Box sx={{ textAlign: 'center', py: 4 }}>
								<CircularProgress />
							</Box>
						)}

						{errorMessages && (
							<Alert severity='error' sx={{ mb: 2 }}>
								{errorMessages}
							</Alert>
						)}

						{!loadingMessages && !errorMessages && (
							<Box>
								{messages.length > 0 ? (
									<Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 2 }}>
										{messages.map(msg => (
											<Box
												key={msg.id}
												sx={{
													mb: 1,
													p: 1,
													bgcolor:
														msg.sender === 'user'
															? 'grey.100'
															: 'primary.light',
													borderRadius: 1,
												}}
											>
												<Typography variant='body2' color='text.secondary'>
													{msg.sender === 'user' ? 'Вы' : 'Контакт'} •{' '}
													{new Date(msg.createdAt).toLocaleString()}
												</Typography>
												<Typography>{msg.content}</Typography>
											</Box>
										))}
									</Box>
								) : (
									<Typography>Сообщений нет</Typography>
								)}

								{initialDeal.contactId && (
									<Box sx={{ display: 'flex', gap: 1 }}>
										<TextField
											fullWidth
											value={newMessage}
											onChange={e => setNewMessage(e.target.value)}
											placeholder='Напишите сообщение...'
										/>
										<Button
											variant='contained'
											color='primary'
											onClick={handleSendMessage}
											disabled={!newMessage.trim()}
										>
											Отправить
										</Button>
									</Box>
								)}
							</Box>
						)}
					</Box>
				)}

				{tab === 'activity' && (
					<Box>
						<Typography variant='h6' gutterBottom>
							Активность по сделке
						</Typography>

						{loadingActivities && (
							<Box sx={{ textAlign: 'center', py: 4 }}>
								<CircularProgress />
							</Box>
						)}

						{errorActivities && (
							<Alert severity='error' sx={{ mb: 2 }}>
								{errorActivities}
							</Alert>
						)}

						{!loadingActivities && !errorActivities && (
							<>
								{activities.length > 0 ? (
									<TableContainer
										component={Paper}
										sx={{ borderRadius: 2, boxShadow: 1 }}
									>
										<Table size='small'>
											<TableHead>
												<TableRow>
													<TableCell>
														<strong>Действие</strong>
													</TableCell>
													<TableCell>
														<strong>Пользователь</strong>
													</TableCell>
													<TableCell>
														<strong>Дата</strong>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{activities.map(act => (
													<TableRow key={act.id}>
														<TableCell>{act.action}</TableCell>
														<TableCell>{act.user.email}</TableCell>
														<TableCell>
															{new Date(act.createdAt).toLocaleString()}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Typography>Активностей нет</Typography>
								)}
							</>
						)}
					</Box>
				)}

				{tab === 'files' && (
					<Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 2,
							}}
						>
							<Typography variant='h6'>Файлы сделки</Typography>
							<Button
								variant='contained'
								color='primary'
								component='label'
								disabled={uploading}
							>
								{uploading ? 'Загрузка...' : 'Загрузить файл'}
								<input
									type='file'
									hidden
									onChange={handleFileUpload}
									disabled={uploading}
								/>
							</Button>
						</Box>

						{loadingFiles && (
							<Box sx={{ textAlign: 'center', py: 4 }}>
								<CircularProgress />
							</Box>
						)}

						{errorFiles && (
							<Alert severity='error' sx={{ mb: 2 }}>
								{errorFiles}
							</Alert>
						)}

						{!loadingFiles && !errorFiles && (
							<>
								{files.length > 0 ? (
									<TableContainer
										component={Paper}
										sx={{ borderRadius: 2, boxShadow: 1 }}
									>
										<Table size='small'>
											<TableHead>
												<TableRow>
													<TableCell>
														<strong>Название</strong>
													</TableCell>
													<TableCell>
														<strong>Дата загрузки</strong>
													</TableCell>
													<TableCell>
														<strong>Ссылка</strong>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{files.map(file => (
													<TableRow key={file.id}>
														<TableCell>{file.name}</TableCell>
														<TableCell>
															{new Date(file.createdAt).toLocaleDateString()}
														</TableCell>
														<TableCell>
															<a
																href={`/files/download/${file.id}`}
																target='_blank'
																rel='noopener noreferrer'
															>
																Скачать
															</a>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Typography>Файлов не добавлено</Typography>
								)}
							</>
						)}
					</Box>
				)}
			</Paper>
		</Box>
	)
}
