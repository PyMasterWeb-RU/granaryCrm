export interface Contact {
	id: string
	firstName: string
	lastName: string
	email?: string
	phone?: string
}

export interface Company {
	id: string
	name: string
	industry?: string | null
	phone?: string | null
	email?: string | null
	website?: string | null
	address?: string | null
	inn?: string | null
	kpp?: string | null
	ogrn?: string | null
	ownerId: string
	createdAt: string
	owner?: {
		id: string
		email: string
	}
	contacts?: Contact[]
}
