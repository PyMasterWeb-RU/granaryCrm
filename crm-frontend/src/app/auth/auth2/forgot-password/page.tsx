'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo'
import PageContainer from '@/app/components/container/PageContainer'
import AuthForgotPassword from '../../authForms/AuthForgotPassword'

export default function ForgotPassword2() {
	return (
		<PageContainer
			title='Forgot Password Page'
			description='this is Sample page'
		>
			<Box
				sx={{
					position: 'relative',
					'&:before': {
						content: '""',
						background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
						backgroundSize: '400% 400%',
						animation: 'gradient 15s ease infinite',
						position: 'absolute',
						inset: 0,
						opacity: 0.3,
					},
				}}
			>
				<Grid
					container
					spacing={0}
					justifyContent='center'
					sx={{ height: '100vh' }}
				>
					<Grid
						size={{ xs: 12, sm: 12, lg: 4, xl: 3 }}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Card
							elevation={9}
							sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}
						>
							<Box display='flex' alignItems='center' justifyContent='center'>
								<Logo />
							</Box>
							<Typography
								variant='subtitle2'
								color='textSecondary'
								textAlign='center'
								fontWeight={400}
								mt={2}
								mb={3}
							>
								Please enter the email address associated with your account and
								we will email you a link to reset your password.
							</Typography>
							<AuthForgotPassword />
						</Card>
					</Grid>
				</Grid>
			</Box>
		</PageContainer>
	)
}
