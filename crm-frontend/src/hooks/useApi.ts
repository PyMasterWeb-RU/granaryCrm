'use client'

import axiosWithAuth from '@/lib/axiosWithAuth'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface UseApiOptions {
	skip?: boolean
}

export function useApi<T = any>(url: string, options?: UseApiOptions) {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (options?.skip) {
			setLoading(false)
			return
		}

		const fetchData = async () => {
			try {
				const res = await axiosWithAuth.get<T>(url)
				setData(res.data)
			} catch (err) {
				if (axios.isAxiosError(err)) {
					const serverMessage = err.response?.data?.message
					setError(serverMessage || err.message || 'Ошибка загрузки')
				} else {
					setError('Неизвестная ошибка')
				}
				console.error('Ошибка запроса:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [url, options?.skip])

	return { data, loading, error }
}
