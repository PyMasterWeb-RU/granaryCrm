'use client'

import { useApi } from '@/hooks/useApi'
import axiosWithAuth from '@/lib/axiosWithAuth'
import { usePathname, useRouter } from 'next/navigation'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface User {
	id: number
	username: string
	email?: string
}

interface AuthContextType {
	user: User | null
	isAuthenticated: boolean
	loading: boolean
	error: string | null
	fetchUser: () => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter()
	const pathname = usePathname()

	const isAuthPage = pathname.startsWith('/auth')

	const { data, loading, error } = useApi<User>('/users/me', {
		skip: isAuthPage,
	})

	const [user, setUser] = useState<User | null>(null)
	const [initialLoading, setInitialLoading] = useState(true)

	useEffect(() => {
		if (!loading) {
			if (data) {
				setUser(data)
			} else if (error && !isAuthPage) {
				// Если ошибка получения профиля — делаем logout
				logout()
			}
			setInitialLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, error, loading])

	const fetchUser = async () => {
		try {
			const res = await axiosWithAuth.get<User>('/users/me')
			setUser(res.data)
		} catch (err) {
			console.error('Ошибка получения профиля', err)
			await logout() // при ошибке тоже выходим
		}
	}

	const logout = async () => {
		try {
			await axiosWithAuth.post('/auth/logout') // если на сервере реализован logout
		} catch (err) {
			console.error('Ошибка при выходе', err)
		} finally {
			setUser(null)
			if (!pathname.startsWith('/auth')) {
				router.push('/auth/login')
			}
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				loading: initialLoading,
				error,
				fetchUser,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
