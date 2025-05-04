import { createSlice } from '@reduxjs/toolkit'

interface Email {
	id: string
	from: string
	to: string
	subject: string
	text?: string
	html?: string
	date: string
	folder: string
	seen: boolean
	flagged: boolean
	thumbnail?: string
	attachments?: {
		filename: string
		contentType: string
		size: number
		path: string
	}[]
}

interface EmailState {
	emails: Email[]
	templates: any[]
	currentFilter: string
	emailSearch: string
	emailContent: string | null
	selectedEmail: Email | null
}

const initialState: EmailState = {
	emails: [],
	templates: [],
	currentFilter: 'inbox',
	emailSearch: '',
	emailContent: null,
	selectedEmail: null,
}

const emailSlice = createSlice({
	name: 'email',
	initialState,
	reducers: {
		fetchEmails(state, action) {
			state.emails = action.payload
		},
		fetchTemplates(state, action) {
			state.templates = action.payload
		},
		setVisibilityFilter(state, action) {
			state.currentFilter = action.payload
		},
		SearchEmail(state, action) {
			state.emailSearch = action.payload
		},
		SelectEmail(state, action) {
			state.emailContent = action.payload
			state.selectedEmail =
				state.emails.find(email => email.id === action.payload) || null
		},
		updateEmail(state, action) {
			const { id, ...updates } = action.payload
			const email = state.emails.find(e => e.id === id)
			if (email) {
				Object.assign(email, updates)
			}
			if (state.selectedEmail && state.selectedEmail.id === id) {
				Object.assign(state.selectedEmail, updates)
			}
		},
		deleteEmail(state, action) {
			state.emails = state.emails.filter(email => email.id !== action.payload)
			if (state.emailContent === action.payload) {
				state.emailContent = null
				state.selectedEmail = null
			}
		},
	},
})

export const {
	fetchEmails,
	fetchTemplates,
	setVisibilityFilter,
	SearchEmail,
	SelectEmail,
	updateEmail,
	deleteEmail,
} = emailSlice.actions

export default emailSlice.reducer
