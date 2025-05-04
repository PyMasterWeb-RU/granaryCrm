// src/app/(DashboardLayout)/settings/ui-config/[entity]/page.tsx
import { Box, Typography } from '@mui/material'
import UiConfigEditor from './UiConfigEditor'

interface PageProps {
	params: { entity: string }
}

export default function Page({ params }: PageProps) {
	const { entity } = params

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' gutterBottom>
				Настройка полей: {entity}
			</Typography>
			<UiConfigEditor entity={entity} />
		</Box>
	)
}
