import { setVisibilityFilter } from '@/store/apps/email/EmailSlice'
import { useDispatch, useSelector } from '@/store/hooks'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import {
	IconFlag,
	IconMail,
	IconNote,
	IconSend,
	IconTrash,
} from '@tabler/icons-react'
import Scrollbar from '../../../components/custom-scroll/Scrollbar'
import EmailCompose from './EmailCompose'

interface FilterType {
	id?: number
	filterbyTitle?: string
	icon?: any
	name?: string
	divider?: boolean
	color?: string
}

const EmailFilter = () => {
	const active = useSelector(state => state.emailReducer.currentFilter)
	const customizer = useSelector(state => state.customizer)
	const br = `${customizer.borderRadius}px`
	const dispatch = useDispatch()

	const filterData: FilterType[] = [
		{ id: 1, name: 'inbox', icon: IconMail, color: 'inherit' },
		{ id: 2, name: 'sent', icon: IconSend, color: 'inherit' },
		{ id: 3, name: 'drafts', icon: IconNote, color: 'inherit' },
		{ id: 4, name: 'spam', icon: IconFlag, color: 'inherit' },
		{ id: 5, name: 'trash', icon: IconTrash, color: 'inherit' },
	]

	return (
		<>
			<Box>
				<EmailCompose />
			</Box>
			<List>
				<Scrollbar
					sx={{
						height: { lg: 'calc(100vh - 100px)', md: '100vh' },
						maxHeight: '800px',
					}}
				>
					{filterData.map(filter => {
						if (filter.filterbyTitle) {
							return (
								<Typography
									variant='subtitle2'
									p={3}
									pb={1}
									pl={5.5}
									fontWeight={600}
									key={filter.id}
								>
									{filter.filterbyTitle}
								</Typography>
							)
						} else if (filter.divider) {
							return <Divider key={filter.id} />
						}

						return (
							<ListItemButton
								sx={{ mb: 1, px: '20px', mx: 3, borderRadius: br }}
								selected={active === filter.name}
								onClick={() => dispatch(setVisibilityFilter(filter.name))}
								key={`${filter.id}${filter.name}`}
							>
								<ListItemIcon sx={{ minWidth: '30px', color: filter.color }}>
									<filter.icon stroke='1.5' size={19} />
								</ListItemIcon>
								<ListItemText sx={{ textTransform: 'capitalize' }}>
									{filter.name}
								</ListItemText>
							</ListItemButton>
						)
					})}
				</Scrollbar>
			</List>
		</>
	)
}

export default EmailFilter
