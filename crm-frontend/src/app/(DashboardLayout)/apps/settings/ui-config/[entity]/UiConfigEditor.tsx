// src/app/(DashboardLayout)/settings/ui-config/[entity]/UiConfigEditor.tsx
'use client'

import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

export interface UIFieldConfig {
	id?: string
	name: string
	label: string
	section?: string
	visible: boolean
	required: boolean
	order: number
}

interface Props {
	entity: string
}

export default function UiConfigEditor({ entity }: Props) {
	const [fields, setFields] = useState<UIFieldConfig[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Загрузка текущих настроек
	useEffect(() => {
		setLoading(true)
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui-config/${entity}`, {
			credentials: 'include',
		})
			.then(res => {
				if (!res.ok) throw new Error(res.statusText)
				return res.json()
			})
			.then((data: UIFieldConfig[]) => {
				setFields(data)
				setError(null)
			})
			.catch(err => setError(err.message || 'Ошибка загрузки'))
			.finally(() => setLoading(false))
	}, [entity])

	// Обработчик изменения одного поля
	const handleFieldChange = (
		idx: number,
		key: keyof UIFieldConfig,
		value: string | boolean | number
	) => {
		setFields(current =>
			current.map((f, i) =>
				i === idx
					? {
							...f,
							[key]: value,
					  }
					: f
			)
		)
	}

	// Сохранение изменений
	const handleSave = async () => {
		setSaving(true)
		try {
			const body = fields.map(({ id, ...rest }) => rest)
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/ui-config/${entity}`,
				{
					method: 'PUT',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				}
			)
			if (!res.ok) throw new Error(await res.text())
			alert('Сохранено')
		} catch (err: any) {
			alert('Ошибка при сохранении: ' + err.message)
		} finally {
			setSaving(false)
		}
	}

	if (loading)
		return (
			<Box sx={{ textAlign: 'center', py: 4 }}>
				<CircularProgress />
			</Box>
		)

	if (error)
		return (
			<Typography color='error' sx={{ py: 4, textAlign: 'center' }}>
				{error}
			</Typography>
		)

	return (
		<Box>
			<TableContainer component={Paper} sx={{ mb: 2 }}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Поле (name)</TableCell>
							<TableCell>Метка (label)</TableCell>
							<TableCell>Группа (section)</TableCell>
							<TableCell>Видимо</TableCell>
							<TableCell>Обязательно</TableCell>
							<TableCell>Порядок</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{fields.map((f, idx) => (
							<TableRow key={f.name}>
								<TableCell>{f.name}</TableCell>
								<TableCell>
									<TextField
										size='small'
										value={f.label}
										onChange={e =>
											handleFieldChange(idx, 'label', e.target.value)
										}
									/>
								</TableCell>
								<TableCell>
									<TextField
										size='small'
										value={f.section || ''}
										onChange={e =>
											handleFieldChange(idx, 'section', e.target.value)
										}
									/>
								</TableCell>
								<TableCell>
									<Checkbox
										checked={f.visible}
										onChange={e =>
											handleFieldChange(idx, 'visible', e.target.checked)
										}
									/>
								</TableCell>
								<TableCell>
									<Checkbox
										checked={f.required}
										onChange={e =>
											handleFieldChange(idx, 'required', e.target.checked)
										}
									/>
								</TableCell>
								<TableCell>
									<TextField
										size='small'
										type='number'
										value={f.order}
										onChange={e =>
											handleFieldChange(idx, 'order', Number(e.target.value))
										}
										inputProps={{ style: { width: 60 } }}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Button
				variant='contained'
				onClick={handleSave}
				disabled={saving}
				startIcon={saving ? <CircularProgress size={16} /> : undefined}
			>
				Сохранить
			</Button>
		</Box>
	)
}
