'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import BlankCard from '@/app/components/shared/BlankCard'
import {
	Box,
	Button,
	CardContent,
	Chip,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Switch,
	Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import { IconCheck, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Pricing' }]

const pricing = [
	{
		id: 1,
		package: 'Silver',
		plan: 'Free',
		avatar: '/images/backgrounds/silver.png',
		badge: false,
		btntext: 'Choose Silver',
		rules: [
			{ limit: true, title: '3 Members' },
			{ limit: true, title: 'Single Device' },
			{ limit: false, title: '50GB Storage' },
			{ limit: false, title: 'Monthly Backups' },
			{ limit: false, title: 'Permissions & workflows' },
		],
	},
	{
		id: 2,
		package: 'Bronze',
		monthlyplan: 10.99,
		avatar: '/images/backgrounds/bronze.png',
		badge: true,
		btntext: 'Choose Bronze',
		rules: [
			{ limit: true, title: '5 Members' },
			{ limit: true, title: 'Multiple Device' },
			{ limit: true, title: '80GB Storage' },
			{ limit: false, title: 'Monthly Backups' },
			{ limit: false, title: 'Permissions & workflows' },
		],
	},
	{
		id: 3,
		package: 'Gold',
		monthlyplan: 22.99,
		avatar: '/images/backgrounds/gold.png',
		badge: false,
		btntext: 'Choose Gold',
		rules: [
			{ limit: true, title: 'Unlimited Members' },
			{ limit: true, title: 'Multiple Device' },
			{ limit: true, title: '150GB Storage' },
			{ limit: true, title: 'Monthly Backups' },
			{ limit: true, title: 'Permissions & workflows' },
		],
	},
]

const Pricing = () => {
	const [show, setShow] = React.useState(false)
	const theme = useTheme()
	const warninglight = theme.palette.warning.light
	const warning = theme.palette.warning.main

	const StyledChip = styled(Chip)({
		position: 'absolute',
		top: '15px',
		right: '30px',
		backgroundColor: warninglight,
		color: warning,
		textTransform: 'uppercase',
		fontSize: '11px',
	})

	const yearlyPrice = (price: number) => price * 12

	return (
		<PageContainer title='Pricing' description='this is Pricing'>
			<Breadcrumb title='Pricing' items={BCrumb} />

			<Grid container spacing={3} justifyContent='center' mt={3}>
				<Grid size={{ xs: 12, sm: 10, lg: 8 }} textAlign='center'>
					<Typography variant='h2'>
						Flexible Plans Tailored to Fit Your Community&apos;s Unique Needs!
					</Typography>
					<Box
						display='flex'
						alignItems='center'
						mt={3}
						justifyContent='center'
					>
						<Typography variant='subtitle1'>Monthly</Typography>
						<Switch onChange={() => setShow(!show)} />
						<Typography variant='subtitle1'>Yearly</Typography>
					</Box>
				</Grid>
			</Grid>

			<Grid container spacing={3} mt={5}>
				{pricing.map(price => (
					<Grid key={price.id} size={{ xs: 12, sm: 6, lg: 4 }}>
						<BlankCard>
							<CardContent sx={{ p: '30px' }}>
								{price.badge && <StyledChip label='Popular' size='small' />}

								<Typography
									variant='subtitle1'
									fontSize='12px'
									mb={3}
									color='textSecondary'
									textTransform='uppercase'
								>
									{price.package}
								</Typography>

								<Image
									src={price.avatar}
									alt={price.package}
									width={90}
									height={90}
								/>

								<Box my={4}>
									{price.plan === 'Free' ? (
										<Box fontSize='50px' mt={5} fontWeight={600}>
											{price.plan}
										</Box>
									) : (
										<Box display='flex' alignItems='flex-end'>
											<Typography variant='h6' mr='8px'>
												$
											</Typography>
											<Typography fontSize='48px' fontWeight={600}>
												{show
													? yearlyPrice(price.monthlyplan as number)
													: price.monthlyplan}
											</Typography>
											<Typography
												fontSize='15px'
												fontWeight={400}
												ml={1}
												color='textSecondary'
												mb='8px'
											>
												{show ? '/yr' : '/mo'}
											</Typography>
										</Box>
									)}
								</Box>

								<List>
									{price.rules.map((rule, i) => (
										<ListItem
											key={i}
											disableGutters
											sx={{ color: rule.limit ? 'inherit' : 'grey.400' }}
										>
											<ListItemIcon
												sx={{
													color: rule.limit ? 'primary.main' : 'grey.400',
													minWidth: 32,
												}}
											>
												{rule.limit ? (
													<IconCheck width={18} />
												) : (
													<IconX width={18} />
												)}
											</ListItemIcon>
											<ListItemText>{rule.title}</ListItemText>
										</ListItem>
									))}
								</List>

								<Button
									variant='contained'
									size='large'
									sx={{ width: '100%', mt: 3 }}
								>
									{price.btntext}
								</Button>
							</CardContent>
						</BlankCard>
					</Grid>
				))}
			</Grid>
		</PageContainer>
	)
}

export default Pricing
