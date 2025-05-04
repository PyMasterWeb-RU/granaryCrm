'use client'
import { useSelector } from '@/store/hooks'
import { AppState } from '@/store/store'
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'

type Props = {
	title: string
	footer?: string | JSX.Element
	codeModel?: JSX.Element | JSX.Element[]
	children: JSX.Element
}

const ParentCard = ({ title, children, footer, codeModel }: Props) => {
	const customizer = useSelector((state: AppState) => state.customizer)

	const theme = useTheme()
	const borderColor = theme.palette.divider

	return (
		<Card
			sx={{
				padding: 0,
				border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none',
			}}
			elevation={customizer.isCardShadow ? 9 : 0}
			variant={!customizer.isCardShadow ? 'outlined' : undefined}
		>
			<CardHeader title={title} action={codeModel} />
			<Divider />

			<CardContent>{children}</CardContent>
			{footer ? (
				<>
					<Divider />
					<Box p={3}>{footer}</Box>
				</>
			) : (
				''
			)}
		</Card>
	)
}

export default ParentCard
