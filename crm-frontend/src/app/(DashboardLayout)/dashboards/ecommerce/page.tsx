'use client'
import PageContainer from '@/app/components/container/PageContainer'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'

import Expence from '@/app/components/dashboards/ecommerce/Expence'
import Growth from '@/app/components/dashboards/ecommerce/Growth'
import MonthlyEarnings from '@/app/components/dashboards/ecommerce/MonthlyEarnings'
import PaymentGateways from '@/app/components/dashboards/ecommerce/PaymentGateways'
import ProductPerformances from '@/app/components/dashboards/ecommerce/ProductPerformances'
import RecentTransactions from '@/app/components/dashboards/ecommerce/RecentTransactions'
import RevenueUpdates from '@/app/components/dashboards/ecommerce/RevenueUpdates'
import Sales from '@/app/components/dashboards/ecommerce/Sales'
import SalesOverview from '@/app/components/dashboards/ecommerce/SalesOverview'
import SalesTwo from '@/app/components/dashboards/ecommerce/SalesTwo'
import WelcomeCard from '@/app/components/dashboards/ecommerce/WelcomeCard'
import YearlySales from '@/app/components/dashboards/ecommerce/YearlySales'
import WeeklyStats from '@/app/components/dashboards/modern/WeeklyStats'

const Ecommerce = () => {
	const [isLoading, setLoading] = useState(true)
	useEffect(() => {
		setLoading(false)
	}, [])

	return (
		<PageContainer
			title='eCommerce Dashboard'
			description='this is eCommerce Dashboard'
		>
			<Box mt={3}>
				<Grid container spacing={3}>
					{/* Welcome */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<WelcomeCard />
					</Grid>

					{/* Expense & Sales */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<Grid container spacing={3}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Expence isLoading={isLoading} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Sales isLoading={isLoading} />
							</Grid>
						</Grid>
					</Grid>

					{/* Revenue Updates */}
					<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
						<RevenueUpdates isLoading={isLoading} />
					</Grid>

					{/* Sales Overview */}
					<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
						<SalesOverview isLoading={isLoading} />
					</Grid>

					{/* SalesTwo, Growth, Monthly */}
					<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
						<Grid container spacing={3}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<SalesTwo isLoading={isLoading} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Growth isLoading={isLoading} />
							</Grid>
							<Grid size={12}>
								<MonthlyEarnings isLoading={isLoading} />
							</Grid>
						</Grid>
					</Grid>

					{/* Weekly Stats */}
					<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
						<WeeklyStats isLoading={isLoading} />
					</Grid>

					{/* Yearly Sales */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<YearlySales isLoading={isLoading} />
					</Grid>

					{/* Payment Gateways */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<PaymentGateways />
					</Grid>

					{/* Recent Transactions */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<RecentTransactions />
					</Grid>

					{/* Product Performances */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<ProductPerformances />
					</Grid>
				</Grid>
			</Box>
		</PageContainer>
	)
}

export default Ecommerce
