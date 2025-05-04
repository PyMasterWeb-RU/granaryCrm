// src/store/apps/auth/authSlice.ts
import type { RootState } from '@/store/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
	id: string
	email: string
	name?: string
}

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface AuthState {
	user: AuthUser | null | undefined // undefined — ещё не загружали, null — не авторизован
	status: AuthStatus
}

const initialState: AuthState = {
	user: undefined,
	status: 'idle',
}

// подтягиваем базовый URL из .env (NEXT_PUBLIC_API_URL=http://localhost:4200/api)
const API = process.env.NEXT_PUBLIC_API_URL

export const fetchCurrentUser = createAsyncThunk<
	AuthUser,
	void,
	{ rejectValue: null }
>('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
	try {
		const res = await fetch(`${API}/users/me`, {
			credentials: 'include',
			cache: 'no-store',
		})
		if (!res.ok) return rejectWithValue(null)
		return (await res.json()) as AuthUser
	} catch {
		return rejectWithValue(null)
	}
})

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearUser(state) {
			state.user = null
			state.status = 'idle'
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchCurrentUser.pending, state => {
				state.status = 'loading'
				state.user = undefined
			})
			.addCase(
				fetchCurrentUser.fulfilled,
				(state, action: PayloadAction<AuthUser>) => {
					state.status = 'succeeded'
					state.user = action.payload
				}
			)
			.addCase(fetchCurrentUser.rejected, state => {
				state.status = 'failed'
				state.user = null
			})
	},
})

export const { clearUser } = authSlice.actions
export default authSlice.reducer

// Селектор всего `auth`-слайса
export const selectAuth = (state: RootState) => state.auth
