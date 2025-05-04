// src/app/(DashboardLayout)/settings/SettingsSection.tsx

'use client'

import {
	SettingOption,
	createOption,
	deleteOption,
	fetchOptions,
	updateOption,
} from '@/lib/settings'
import {
	Add as AddIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
} from '@mui/icons-material'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface Props {
	category: string
	title: string
}

export default function SettingsSection({ category, title }: Props) {
	const [options, setOptions] = useState<SettingOption[]>([])
	const [loading, setLoading] = useState(false)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<SettingOption | null>(null)
	const [label, setLabel] = useState('')
	const [value, setValue] = useState('')

	const load = async () => {
		setLoading(true)
		try {
			setOptions(await fetchOptions(category))
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [category])

	const openNew = () => {
		setEditing(null)
		setLabel('')
		setValue('')
		setDialogOpen(true)
	}
	const openEdit = (opt: SettingOption) => {
		setEditing(opt)
		setLabel(opt.label)
		setValue(opt.value)
		setDialogOpen(true)
	}

	const save = async () => {
		try {
			if (editing) {
				await updateOption(editing.id, label, value, editing.position)
			} else {
				await createOption(category, label, value)
			}
			setDialogOpen(false)
			await load()
		} catch (e) {
			console.error(e)
		}
	}

	const remove = async (id: string) => {
		if (!confirm('Удалить эту опцию?')) return
		await deleteOption(id)
		await load()
	}

	return (
		<Paper sx={{ p: 2, mb: 4 }}>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				mb={2}
			>
				<Typography variant='h6'>{title}</Typography>
				<Button startIcon={<AddIcon />} onClick={openNew} disabled={loading}>
					Добавить
				</Button>
			</Box>

			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell>Позиция</TableCell>
						<TableCell>Метка</TableCell>
						<TableCell>Значение</TableCell>
						<TableCell align='right'>Действия</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{options.map(opt => (
						<TableRow key={opt.id}>
							<TableCell>{opt.position}</TableCell>
							<TableCell>{opt.label}</TableCell>
							<TableCell>{opt.value}</TableCell>
							<TableCell align='right'>
								<IconButton size='small' onClick={() => openEdit(opt)}>
									<EditIcon fontSize='small' />
								</IconButton>
								<IconButton size='small' onClick={() => remove(opt.id)}>
									<DeleteIcon fontSize='small' />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>
					{editing ? 'Редактировать опцию' : 'Новая опция'}
				</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label='Метка'
						value={label}
						onChange={e => setLabel(e.target.value)}
						sx={{ mt: 2 }}
					/>
					<TextField
						fullWidth
						label='Значение'
						value={value}
						onChange={e => setValue(e.target.value)}
						sx={{ mt: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Отмена</Button>
					<Button onClick={save} variant='contained'>
						Сохранить
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	)
}
