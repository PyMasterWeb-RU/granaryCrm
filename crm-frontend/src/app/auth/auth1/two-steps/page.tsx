'use client'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Image from 'next/image'

import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo'
import PageContainer from '@/app/components/container/PageContainer'
import AuthTwoSteps from '../../authForms/AuthTwoSteps'

export default function TwoSteps() {
	return (
		<PageContainer title='Two Steps Page' description='this is Sample page'>
			<Grid
				container
				spacing={0}
				justifyContent='center'
				sx={{ overflowX: 'hidden' }}
			>
				{/* Illustration column */}
				<Grid
					size={{ xs: 12, sm: 12, lg: 8, xl: 9 }}
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
					<Box position='relative'>
						<Box px={3}>
							<Logo />
						</Box>
						<Box
							display={{ xs: 'none', lg: 'flex' }}
							alignItems='center'
							justifyContent='center'
							height='calc(100vh - 75px)'
						>
							<Image
								src='/images/backgrounds/login-bg.svg'
								alt='Background'
								width={500}
								height={500}
								style={{
									width: '100%',
									maxWidth: '500px',
									maxHeight: '500px',
								}}
							/>
						</Box>
					</Box>
				</Grid>

				{/* Form column */}
				<Grid
					size={{ xs: 12, sm: 12, lg: 4, xl: 3 }}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Box p={4}>
						<Typography variant='h4' fontWeight={700}>
							Two Step Verification
						</Typography>
						<Typography variant='subtitle1' color='textSecondary' mt={2} mb={1}>
							We sent a verification code to your mobile. Enter the code from
							the mobile in the field below.
						</Typography>
						<Typography variant='subtitle1' fontWeight={700} mb={1}>
							******1234
						</Typography>
						<AuthTwoSteps />
					</Box>
				</Grid>
			</Grid>
		</PageContainer>
	)
}
