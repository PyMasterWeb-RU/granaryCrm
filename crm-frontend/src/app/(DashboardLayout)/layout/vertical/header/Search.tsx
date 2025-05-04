'use client'

import {
	Box,
	CircularProgress,
	Dialog,
	DialogContent,
	Divider,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	ListSubheader,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { IconSearch, IconX } from '@tabler/icons-react'
import debounce from 'lodash/debounce'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface SearchResult<T> {
	id: string
	[key: string]: any
}

interface ApiResponse {
	deals: SearchResult<{ title: string; stage: string; createdAt: string }>[]
	contacts: SearchResult<{
		firstName: string
		lastName: string
		email?: string
	}>[]
	accounts: SearchResult<{ name: string; industry?: string }>[]
	activities: SearchResult<{ title: string; type: string; date: string }>[]
	emails: SearchResult<{
		subject: string
		from: string
		to: string
		date: string
	}>[]
}

export default function Search() {
	const API_URL = process.env.NEXT_PUBLIC_API_URL!
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [results, setResults] = useState<ApiResponse | null>(null)

	const fetchResults = useCallback(
		debounce(async (q: string) => {
			if (!q) {
				setResults(null)
				setLoading(false)
				return
			}
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(
					`${API_URL}/search?q=${encodeURIComponent(q)}`,
					{
						credentials: 'include',
						cache: 'no-store',
					}
				)
				if (!res.ok) throw new Error(res.statusText)
				const json: ApiResponse = await res.json()
				setResults(json)
			} catch (err: any) {
				console.error('Search error:', err)
				setError('Не удалось выполнить поиск.')
			} finally {
				setLoading(false)
			}
		}, 300),
		[API_URL]
	)

	useEffect(() => {
		setLoading(true)
		fetchResults(query.trim())
	}, [query, fetchResults])

	return (
		<>
			<IconButton color='inherit' onClick={() => setOpen(true)} size='large'>
				<IconSearch size={20} />
			</IconButton>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				fullWidth
				maxWidth='sm'
				PaperProps={{ sx: { position: 'fixed', top: 24, m: 0 } }}
			>
				<DialogContent>
					<Stack direction='row' spacing={1} alignItems='center'>
						<TextField
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder='Поиск...'
							fullWidth
							inputProps={{ 'aria-label': 'Search' }}
						/>
						<IconButton onClick={() => setOpen(false)}>
							<IconX size={20} />
						</IconButton>
					</Stack>
				</DialogContent>
				<Divider />
				<Box p={2} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
					{loading ? (
						<Box textAlign='center' py={4}>
							<CircularProgress />
						</Box>
					) : error ? (
						<Typography color='error' align='center'>
							{error}
						</Typography>
					) : results ? (
						<List disablePadding>
							{results.deals.length > 0 && (
								<>
									<ListSubheader>Сделки</ListSubheader>
									{results.deals.map(item => (
										<ListItemButton
											key={item.id}
											component={Link}
											href={`/apps/deals/${item.id}`}
											sx={{ py: 0.5 }}
										>
											<ListItemText
												primary={item.title}
												secondary={`Стадия: ${item.stage}`}
											/>
										</ListItemButton>
									))}
								</>
							)}
							{results.contacts.length > 0 && (
								<>
									<ListSubheader>Контакты</ListSubheader>
									{results.contacts.map(item => (
										<ListItemButton
											key={item.id}
											component={Link}
											href={`/apps/contacts/${item.id}`}
											sx={{ py: 0.5 }}
										>
											<ListItemText
												primary={`${item.firstName} ${item.lastName}`}
												secondary={item.email || ''}
											/>
										</ListItemButton>
									))}
								</>
							)}
							{results.accounts.length > 0 && (
								<>
									<ListSubheader>Компании</ListSubheader>
									{results.accounts.map(item => (
										<ListItemButton
											key={item.id}
											component={Link}
											href={`/apps/companies/${item.id}`}
											sx={{ py: 0.5 }}
										>
											<ListItemText
												primary={item.name}
												secondary={item.industry || ''}
											/>
										</ListItemButton>
									))}
								</>
							)}
							{results.activities.length > 0 && (
								<>
									<ListSubheader>Задачи / Активности</ListSubheader>
									{results.activities.map(item => (
										<ListItemButton
											key={item.id}
											component={Link}
											href={`/apps/activities/${item.id}`}
											sx={{ py: 0.5 }}
										>
											<ListItemText
												primary={item.title}
												secondary={`${item.type} — ${new Date(
													item.date
												).toLocaleString()}`}
											/>
										</ListItemButton>
									))}
								</>
							)}
							{results.emails.length > 0 && (
								<>
									<ListSubheader>Почта</ListSubheader>
									{results.emails.map(item => (
										<ListItemButton
											key={item.id}
											component={Link}
											href={`/apps/email/${item.id}`}
											sx={{ py: 0.5 }}
										>
											<ListItemText
												primary={item.subject}
												secondary={`От: ${item.from} → ${item.to}`}
											/>
										</ListItemButton>
									))}
								</>
							)}
							{[
								['deals', 'Сделки'],
								['contacts', 'Контакты'],
								['accounts', 'Компании'],
								['activities', 'Активности'],
								['emails', 'Почта'],
							].every(([key]) => (results as any)[key].length === 0) && (
								<Typography align='center' sx={{ py: 2 }}>
									Ничего не найдено
								</Typography>
							)}
						</List>
					) : (
						<Typography align='center' color='text.secondary'>
							Введите запрос для поиска
						</Typography>
					)}
				</Box>
			</Dialog>
		</>
	)
}
