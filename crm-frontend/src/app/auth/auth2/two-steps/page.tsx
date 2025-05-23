'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo'
import PageContainer from '@/app/components/container/PageContainer'
import AuthTwoSteps from '../../authForms/AuthTwoSteps'

export default function TwoSteps2() {
	return (
		<PageContainer title='Two Steps Page' description='this is Sample page'>
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
					sx={{ height: '100vh', overflowX: 'hidden' }}
				>
					<Grid
						size={{ xs: 12, sm: 12, lg: 5, xl: 4 }}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Card
							elevation={9}
							sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}
						>
							<Box
								display='flex'
								alignItems='center'
								justifyContent='center'
								mb={2}
							>
								<Logo />
							</Box>
							<Typography
								variant='subtitle1'
								color='textSecondary'
								textAlign='center'
								mb={1}
							>
								We sent a verification code to your mobile. Enter the code from
								your mobile in the field below.
							</Typography>
							<Typography
								variant='subtitle1'
								textAlign='center'
								fontWeight={700}
								mb={3}
							>
								******1234
							</Typography>
							<AuthTwoSteps />
						</Card>
					</Grid>
				</Grid>
			</Box>
		</PageContainer>
	)
}
