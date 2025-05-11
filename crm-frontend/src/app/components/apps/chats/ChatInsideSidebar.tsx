import { Chat } from '@/types/chat'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { IconDownload } from '@tabler/icons-react'

interface ChatType {
	isInSidebar?: boolean
	chat?: Chat
}

const drawerWidth = 320

const ChatInsideSidebar = ({ isInSidebar, chat }: ChatType) => {
	const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
	const totalMedia =
		chat?.messages.reduce(
			(count, msg) =>
				count +
				msg.files.filter(file => file.mimeType.startsWith('image/')).length,
			0
		) || 0
	const totalAttachments =
		chat?.messages.reduce((count, msg) => count + msg.files.length, 0) || 0

	const StyledStack = styled(Stack)(() => ({
		'.showOnHover': {
			display: 'none',
		},
		'&:hover .showOnHover': {
			display: 'block',
		},
	}))

	return (
		<>
			{isInSidebar ? (
				<Box
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						border: '0',
						borderLeft: '1px',
						borderStyle: 'solid',
						right: '0',
						height: '100%',
						background: theme => theme.palette.background.paper,
						boxShadow: lgUp ? null : theme => theme.shadows[9],
						position: lgUp ? 'relative' : 'absolute',
						borderColor: theme => theme.palette.divider,
					}}
					p={3}
				>
					<Typography variant='h6' mb={2}>
						Медиа ({totalMedia})
					</Typography>
					<Grid container spacing={2}>
						{chat?.messages.map(msg =>
							msg.files.map(file =>
								file.mimeType.startsWith('image/') ? (
									<Grid size={{ xs: 12, lg: 4 }} key={file.id}>
										<Avatar
											src={file.path}
											alt='media'
											variant='rounded'
											sx={{ width: '72px', height: '72px' }}
										/>
									</Grid>
								) : null
							)
						)}
						<Grid size={{ xs: 12, lg: 12 }}>
							{totalMedia === 0 ? (
								<Alert severity='error'>Медиа не найдены!</Alert>
							) : null}
						</Grid>
					</Grid>

					<Typography variant='h6' mt={5} mb={2}>
						Вложения ({totalAttachments})
					</Typography>
					<Box>
						{chat?.messages.map(msg =>
							msg.files.map(file => (
								<StyledStack
									key={`${msg.id}-${file.id}`}
									direction='row'
									gap={2}
								>
									<Avatar
										variant='rounded'
										sx={{
											width: '48px',
											height: '48px',
											bgcolor: theme => theme.palette.grey[100],
										}}
									>
										<Avatar
											src={`/images/icons/file-${
												file.mimeType.split('/')[1] || 'generic'
											}.png`}
											alt='file'
											variant='rounded'
											sx={{ width: '24px', height: '24px' }}
										/>
									</Avatar>
									<Box mr='auto'>
										<Typography variant='subtitle2' fontWeight={600} mb={1}>
											{file.name}
										</Typography>
										<Typography variant='body2'>
											{(file.size / 1024).toFixed(2)} KB
										</Typography>
									</Box>
									<Box className='showOnHover'>
										<IconButton
											aria-label='download'
											href={`/files/download/${file.id}`}
											download
										>
											<IconDownload stroke={1.5} size='20' />
										</IconButton>
									</Box>
								</StyledStack>
							))
						)}
						{totalAttachments === 0 ? (
							<Alert severity='error'>Вложения не найдены!</Alert>
						) : null}
					</Box>
				</Box>
			) : null}
		</>
	)
}

export default ChatInsideSidebar
