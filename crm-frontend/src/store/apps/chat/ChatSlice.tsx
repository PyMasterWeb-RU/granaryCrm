import axiosWithAuth from '@/lib/axiosWithAuth'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface Chat {
	id: string
	type: string
	name?: string
	participants: { user: { id: string; name: string; avatar?: string } }[]
	messages: {
		id: string
		content: string
		createdAt: string
		sender: { id: string; name: string; avatar?: string }
		type?: string
		replyTo?: { id: string; content: string; sender: { name: string } }
	}[]
	deal?: { id: string; title: string }
	account?: { id: string; name: string }
}

interface StateType {
	chats: Chat[]
	chatContent: string | null
	chatSearch: string
	replyTo: Chat['messages'][0] | null
	loading: boolean
	error: string | null
}

const initialState: StateType = {
	chats: [],
	chatContent: null,
	chatSearch: '',
	replyTo: null,
	loading: false,
	error: null,
}

// Асинхронное действие для загрузки чатов
export const fetchChats = createAsyncThunk(
	'chat/fetchChats',
	async (
		{ dealId, accountId }: { dealId?: string; accountId?: string },
		{ rejectWithValue }
	) => {
		try {
			const params = new URLSearchParams()
			if (dealId) params.append('dealId', dealId)
			if (accountId) params.append('accountId', accountId)
			const response = await axiosWithAuth.get(`/chats?${params.toString()}`)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.message || 'Не удалось загрузить чаты')
		}
	}
)

// Асинхронное действие для отправки сообщения
export const sendMsg = createAsyncThunk(
	'chat/sendMsg',
	async (
		{
			chatId,
			msg,
			replyToId,
		}: { chatId: string; msg: string; replyToId?: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosWithAuth.post(`/chats/${chatId}/messages`, {
				content: msg,
				replyToId,
			})
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.message || 'Не удалось отправить сообщение')
		}
	}
)

export const ChatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		SearchChat: (state, action) => {
			state.chatSearch = action.payload
		},
		SelectChat: (state, action) => {
			state.chatContent = action.payload
			state.replyTo = null
		},
		SetReplyTo: (state, action) => {
			state.replyTo = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchChats.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchChats.fulfilled, (state, action) => {
				state.loading = false
				state.chats = action.payload
			})
			.addCase(fetchChats.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})
			.addCase(sendMsg.fulfilled, (state, action) => {
				const chat = state.chats.find(c => c.id === state.chatContent)
				if (chat) {
					chat.messages.push(action.payload)
				}
				state.replyTo = null
			})
			.addCase(sendMsg.rejected, (state, action) => {
				state.error = action.payload as string
			})
	},
})

export const { SearchChat, SelectChat, SetReplyTo } = ChatSlice.actions

export default ChatSlice.reducer
