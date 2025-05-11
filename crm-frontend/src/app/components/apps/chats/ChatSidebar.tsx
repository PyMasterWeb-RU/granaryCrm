import { Drawer, Theme, useMediaQuery } from '@mui/material'
import React from 'react'
import ChatListing from './ChatListing'

interface ChatSidebarProps {
	isMobileSidebarOpen: boolean
	onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void
	dealId?: string
	accountId?: string
}

const drawerWidth = 320

const ChatSidebar: React.FC<ChatSidebarProps> = ({
	isMobileSidebarOpen,
	onSidebarClose,
	dealId,
	accountId,
}) => {
	const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

	return (
		<Drawer
			open={isMobileSidebarOpen}
			onClose={onSidebarClose}
			variant={lgUp ? 'permanent' : 'temporary'}
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				zIndex: lgUp ? 0 : 1,
				[`& .MuiDrawer-paper`]: { position: 'relative' },
			}}
		>
			<ChatListing dealId={dealId} accountId={accountId} />
		</Drawer>
	)
}

export default ChatSidebar
