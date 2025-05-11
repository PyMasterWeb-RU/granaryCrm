'use client'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import React, { useState } from 'react'
import ChatContent from './ChatContent'
import ChatMsgSent from './ChatMsgSent'
import ChatSidebar from './ChatSidebar'

interface ChatsAppProps {
	dealId?: string
	accountId?: string
}

const ChatsApp: React.FC<ChatsAppProps> = ({ dealId, accountId }) => {
	const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)

	return (
		<>
			{/* Left part */}
			<ChatSidebar
				isMobileSidebarOpen={isMobileSidebarOpen}
				onSidebarClose={() => setMobileSidebarOpen(false)}
				dealId={dealId}
				accountId={accountId}
			/>
			{/* Right part */}
			<Box flexGrow={1}>
				<ChatContent toggleChatSidebar={() => setMobileSidebarOpen(true)} />
				<Divider />
				<ChatMsgSent />
			</Box>
		</>
	)
}

export default ChatsApp
