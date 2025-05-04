import { SearchEmail } from '@/store/apps/email/EmailSlice'
import { useDispatch, useSelector } from '@/store/hooks'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { IconMenu2, IconSearch } from '@tabler/icons-react'
import React from 'react'

interface Props {
	onClick: React.MouseEventHandler<HTMLButtonElement>
}

const EmailSearch = ({ onClick }: Props) => {
	const searchTerm = useSelector(state => state.emailReducer.emailSearch)
	const dispatch = useDispatch()

	return (
		<Box display='flex' sx={{ p: 2 }}>
			<Fab
				onClick={onClick}
				color='primary'
				size='small'
				sx={{ mr: 1, flexShrink: '0', display: { xs: 'block', lg: 'none' } }}
			>
				<IconMenu2 width='16' />
			</Fab>
			<TextField
				id='outlined-basic'
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconSearch size='16' />
						</InputAdornment>
					),
				}}
				fullWidth
				size='small'
				value={searchTerm}
				placeholder='Поиск писем'
				variant='outlined'
				onChange={e => dispatch(SearchEmail(e.target.value))}
			/>
		</Box>
	)
}

export default EmailSearch
