// src/app/[lang]/companies/page.tsx
'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import axiosWithAuth from '@/lib/axiosWithAuth'
import {
	Alert,
	Box,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Company {
	id: string
	name: string
	inn: string
	kpp: string
	ogrn: string
	address: string
}

export default function ListCompaniesPage() {
	const { lang } = useParams() as { lang: string }

	const [companies, setCompanies] = useState<Company[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setLoading(true)
		axiosWithAuth
			.get<Company[]>('/accounts')
			.then(res => {
				setCompanies(res.data)
				setError(null)
			})
			.catch(err => {
				console.error(err)
				setError('Не удалось загрузить список компаний')
			})
			.finally(() => setLoading(false))
	}, [])

	return (
		<PageContainer title='Список компаний' description='Таблица всех компаний'>
			<Breadcrumb title='Компании' subtitle='Список' />

			<ParentCard title='Все компании'>
				<Box sx={{ p: 2 }}>
					{loading && (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
							<CircularProgress />
						</Box>
					)}
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					{!loading && !error && (
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Название</TableCell>
										<TableCell>ИНН</TableCell>
										<TableCell>КПП</TableCell>
										<TableCell>ОГРН</TableCell>
										<TableCell>Адрес</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{companies.map(c => (
										<TableRow key={c.id} hover>
											<TableCell>{c.name}</TableCell>
											<TableCell>{c.inn}</TableCell>
											<TableCell>{c.kpp}</TableCell>
											<TableCell>{c.ogrn}</TableCell>
											<TableCell>{c.address}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Box>
			</ParentCard>
		</PageContainer>
	)
}
