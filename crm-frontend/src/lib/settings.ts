// src/lib/api/settings.ts
export interface SettingOption {
	id: string
	label: string
	value: string
	position: number
}

export interface SystemSetting {
	id: string
	key: string
	value: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function fetchOptions(category: string): Promise<SettingOption[]> {
	const res = await fetch(`${API_URL}/settings/options/${category}`, {
		credentials: 'include',
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
	return res.json()
}

export async function createOption(
	category: string,
	label: string,
	value: string
): Promise<SettingOption> {
	const res = await fetch(`${API_URL}/settings/options/${category}`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ label, value }),
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
	return res.json()
}

export async function updateOption(
	id: string,
	label: string,
	value: string,
	position: number
): Promise<SettingOption> {
	const res = await fetch(`${API_URL}/settings/options/${id}`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ label, value, position }),
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
	return res.json()
}

export async function deleteOption(id: string): Promise<void> {
	const res = await fetch(`${API_URL}/settings/options/${id}`, {
		method: 'DELETE',
		credentials: 'include',
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
}

export async function fetchSystemSettings(): Promise<SystemSetting[]> {
	const res = await fetch(`${API_URL}/settings/system`, {
		credentials: 'include',
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
	return res.json()
}

export async function updateSystemSetting(
	key: string,
	value: string
): Promise<SystemSetting> {
	const res = await fetch(`${API_URL}/settings/system`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ key, value }),
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(res.statusText)
	return res.json()
}
