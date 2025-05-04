// store/apps/emailSettingsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EmailSettings {
	smtpHost: string
	smtpPort: number
	smtpSecure: boolean
	imapHost: string
	imapPort: number
	imapSecure: boolean
	email: string
}

export const fetchEmailSettings = createAsyncThunk<
	EmailSettings,
	void,
	{ rejectValue: string }
>('emailSettings/fetch', async (_, { rejectWithValue }) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/email-account/me`,
		{
			credentials: 'include',
		}
	)
	if (!res.ok) return rejectWithValue('Не удалось загрузить настройки')
	return (await res.json()) as EmailSettings
})

export const saveEmailSettings = createAsyncThunk<
	EmailSettings,
	EmailSettings & { password: string },
	{ rejectValue: string }
>('emailSettings/save', async (data, { rejectWithValue }) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email-account`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data),
	})
	if (!res.ok) return rejectWithValue('Не удалось сохранить настройки')
	return (await res.json()) as EmailSettings
})

interface State {
	settings: EmailSettings | null
	status: 'idle' | 'loading' | 'failed'
	error: string | null
}

const initialState: State = {
	settings: null,
	status: 'idle',
	error: null,
}

const slice = createSlice({
	name: 'emailSettings',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchEmailSettings.pending, state => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(
				fetchEmailSettings.fulfilled,
				(state, action: PayloadAction<EmailSettings>) => {
					state.status = 'idle'
					state.settings = action.payload
				}
			)
			.addCase(fetchEmailSettings.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})
			.addCase(saveEmailSettings.pending, state => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(
				saveEmailSettings.fulfilled,
				(state, action: PayloadAction<EmailSettings>) => {
					state.status = 'idle'
					state.settings = action.payload
				}
			)
			.addCase(saveEmailSettings.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})
	},
})

export default slice.reducer
