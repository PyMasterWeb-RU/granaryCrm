// src/app/(DashboardLayout)/settings/page.tsx

'use client'

import {
	fetchSystemSettings,
	SystemSetting,
	updateSystemSetting,
} from '@/lib/settings'
import {
	Button,
	Container,
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
import SettingsSection from './SettingsSection'

export default function SettingsPage() {
	const [system, setSystem] = useState<SystemSetting[]>([])
	const [edited, setEdited] = useState<Record<string, string>>({})

	useEffect(() => {
		fetchSystemSettings().then(data => {
			setSystem(data)
			const init: Record<string, string> = {}
			data.forEach(s => {
				init[s.key] = s.value
			})
			setEdited(init)
		})
	}, [])

	const saveSystem = async (key: string) => {
		await updateSystemSetting(key, edited[key])
		// (необязательно) перезагрузить
	}

	return (
		<Container sx={{ py: 4 }}>
			<Typography variant='h4' gutterBottom>
				Настройки системы
			</Typography>
			<SettingsSection category='deal-stage' title='Этапы сделки' />
			<SettingsSection category='activity-status' title='Статусы задач' />
			{/* Повторить для любых нужных категорий */}

			<Paper sx={{ p: 2, mt: 4 }}>
				<Typography variant='h6' mb={2}>
					системные параметры
				</Typography>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Ключ</TableCell>
							<TableCell>Значение</TableCell>
							<TableCell align='right'>Сохранить</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{system.map(s => (
							<TableRow key={s.id}>
								<TableCell>{s.key}</TableCell>
								<TableCell>
									<TextField
										size='small'
										value={edited[s.key] ?? ''}
										onChange={e =>
											setEdited(prev => ({ ...prev, [s.key]: e.target.value }))
										}
									/>
								</TableCell>
								<TableCell align='right'>
									<Button
										onClick={() => saveSystem(s.key)}
										size='small'
										variant='contained'
									>
										Сохранить
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
		</Container>
	)
}
