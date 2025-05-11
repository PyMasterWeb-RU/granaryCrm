export interface Chat {
	id: string
	name?: string
	type: string
	status?: string
	thumb?: string
	messages: Message[]
	participants: { user: { id: string; name: string; avatar?: string } }[]
	deal?: { id: string; title: string }
	account?: { id: string; name: string }
}

export interface Message {
	id: string
	content: string
	createdAt: string
	sender: { id: string; name: string; avatar?: string }
	files: {
		id: string
		name: string
		path: string
		mimeType: string
		size: number
	}[]
	type?: string
	replyTo?: { id: string; content: string; sender: { name: string } }
}
