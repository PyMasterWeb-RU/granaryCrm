// src/lib/api/notifications.ts

export interface Notification {
	id: string
	type: string
	message: string
	link?: string
	isRead: boolean
	createdAt: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function fetchNotifications(): Promise<Notification[]> {
	const res = await fetch(`${API_URL}/internal`, {
		credentials: 'include',
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
	return res.json()
}

export async function markAsRead(id: string): Promise<void> {
	const res = await fetch(`${API_URL}/internal/read/${id}`, {
		method: 'POST',
		credentials: 'include',
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
}

export async function markAllAsRead(): Promise<void> {
	const res = await fetch(`${API_URL}/internal/read-all`, {
		method: 'POST',
		credentials: 'include',
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
}

export async function fetchUnreadCount(): Promise<number> {
	const res = await fetch(`${API_URL}/internal/unread-count`, {
		credentials: 'include',
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
	return res.json()
}
