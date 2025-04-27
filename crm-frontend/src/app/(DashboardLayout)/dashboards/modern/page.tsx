'use client'
import PageContainer from '@/app/components/container/PageContainer'
import { Box, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
// components
import Welcome from '@/app/(DashboardLayout)/layout/shared/welcome/Welcome'
import Customers from '@/app/components/dashboards/modern/Customers'
import EmployeeSalary from '@/app/components/dashboards/modern/EmployeeSalary'
import MonthlyEarnings from '@/app/components/dashboards/modern/MonthlyEarnings'
import Projects from '@/app/components/dashboards/modern/Projects'
import RevenueUpdates from '@/app/components/dashboards/modern/RevenueUpdates'
import SellingProducts from '@/app/components/dashboards/modern/SellingProducts'
import Social from '@/app/components/dashboards/modern/Social'
import TopCards from '@/app/components/dashboards/modern/TopCards'
import TopPerformers from '@/app/components/dashboards/modern/TopPerformers'
import WeeklyStats from '@/app/components/dashboards/modern/WeeklyStats'
import YearlyBreakup from '@/app/components/dashboards/modern/YearlyBreakup'

export default function Dashboard() {
	const [isLoading, setLoading] = useState(true)
	useEffect(() => {
		setLoading(false)
	}, [])

	return (
		<PageContainer title='Dashboard' description='this is Dashboard'>
			<Box>
				<Grid container spacing={3}>
					{/* Top summary cards */}
					<Grid size={12}>
						<TopCards />
					</Grid>

					{/* Revenue & updates */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<RevenueUpdates isLoading={isLoading} />
					</Grid>

					{/* Yearly + Monthly charts */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<Grid container spacing={3}>
							<Grid size={{ xs: 12, sm: 6, lg: 12 }}>
								<YearlyBreakup isLoading={isLoading} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 12 }}>
								<MonthlyEarnings isLoading={isLoading} />
							</Grid>
						</Grid>
					</Grid>

					{/* Employee salary */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<EmployeeSalary isLoading={isLoading} />
					</Grid>

					{/* Customers, Projects, Social */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<Grid container spacing={3}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Customers isLoading={isLoading} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Projects isLoading={isLoading} />
							</Grid>
							<Grid size={12}>
								<Social />
							</Grid>
						</Grid>
					</Grid>

					{/* Selling products */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<SellingProducts />
					</Grid>

					{/* Weekly stats */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<WeeklyStats isLoading={isLoading} />
					</Grid>

					{/* Top performers */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<TopPerformers />
					</Grid>
				</Grid>

				{/* Welcome banner */}
				<Welcome />
			</Box>
		</PageContainer>
	)
}
