// src/lib/axiosWithAuth.ts
import axios from 'axios'

const axiosWithAuth = axios.create({
	// После настройки rewrites в next.config.mjs:
	// все запросы к /backend/* будут проксироваться на ваш NestJS-бэкенд (http://localhost:4200/api/*)
	baseURL: '/backend',
	withCredentials: true, // Чтобы cookie автоматически отправлялась
})

// Перехватчик ответов
axiosWithAuth.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			if (typeof window !== 'undefined') {
				window.location.href = '/auth/login'
			}
		}
		return Promise.reject(error)
	}
)

export default axiosWithAuth
