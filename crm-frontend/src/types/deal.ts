import { Contact } from './company'

export interface Deal {
	id: string
	title: string
	amount: number
	stage: string
	probability: number
	closeDate: string
	dealType?: string
	nomenclature?: string
	packaging?: string
	deliveryType?: string
	transport?: string
	currency?: string
	price?: number
	exchangeRate?: number
	cbRate?: number
	accountId?: string
	contactId?: string
	ownerId: string
	createdAt: string
	account?: {
		id: string
		name: string
	}
	contact?: Contact
	owner?: {
		id: string
		email: string
	}
}
