import Chip from '@mui/material/Chip'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { IconFlag, IconStar, IconTrash } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import React from 'react'
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox'

interface EmailListType {
	id: string
	from: string
	subject: string
	date: string
	seen: boolean
	flagged: boolean
	folder: string
	onClick: React.MouseEventHandler<HTMLElement>
	onChange: React.ChangeEventHandler<HTMLInputElement>
	onStar: React.MouseEventHandler<SVGSVGElement> // Updated to SVGSVGElement
	onImportant: React.MouseEventHandler<SVGSVGElement> // Updated to SVGSVGElement
	onDelete: React.MouseEventHandler<SVGSVGElement> // Updated to SVGSVGElement
	checked?: boolean
	isSelected: boolean
}

const EmailListItem = ({
	id,
	onClick,
	onChange,
	onStar,
	onImportant,
	from,
	subject,
	date,
	checked,
	folder,
	flagged,
	seen,
	onDelete,
	isSelected,
}: EmailListType) => {
	const theme = useTheme()

	return (
		<ListItemButton
			sx={{ mb: 1, py: 2 }}
			selected={isSelected}
			alignItems='flex-start'
		>
			<ListItemIcon sx={{ minWidth: '35px', mt: '0' }}>
				<CustomCheckbox
					edge='start'
					id={`check${id}`}
					tabIndex={-1}
					onChange={onChange}
				/>
			</ListItemIcon>
			<ListItemText onClick={onClick}>
				<Stack direction='row' gap='10px' alignItems='center'>
					<Typography variant='subtitle2' mb={0.5} fontWeight={600} mr='auto'>
						{from}
					</Typography>
					<Chip
						label={folder}
						size='small'
						color={
							folder === 'inbox'
								? 'primary'
								: folder === 'sent'
								? 'success'
								: folder === 'spam'
								? 'error'
								: 'warning'
						}
					/>
				</Stack>
				<Typography
					variant='subtitle2'
					noWrap
					width='80%'
					color='text.secondary'
				>
					{subject}
				</Typography>
				<Stack direction='row' mt={1} gap='10px' alignItems='center'>
					<IconStar
						stroke={1}
						size='18'
						style={{
							fill: flagged ? theme.palette.warning.main : '',
							stroke: flagged ? theme.palette.warning.main : '',
						}}
						onClick={onStar}
					/>
					<IconFlag
						size='18'
						stroke={1.2}
						style={{ fill: seen ? theme.palette.error.light : '' }}
						onClick={onImportant}
					/>
					{checked && <IconTrash stroke={1.5} size='16' onClick={onDelete} />}
					<Typography variant='caption' noWrap sx={{ ml: 'auto' }}>
						{formatDistanceToNow(new Date(date), {
							addSuffix: true,
							locale: ru,
						})}
					</Typography>
				</Stack>
			</ListItemText>
		</ListItemButton>
	)
}

export default EmailListItem
