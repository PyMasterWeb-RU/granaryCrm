'use client'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'

import PageContainer from '@/app/components/container/PageContainer'
// components
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
			<Box mt={3}>
				<Grid container spacing={3}>
					{/* full-width */}
					<Grid size={12}>
						<TopCards />
					</Grid>

					{/* main revenue */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<RevenueUpdates isLoading={isLoading} />
					</Grid>

					{/* side charts */}
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

					{/* employee salary */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<EmployeeSalary isLoading={isLoading} />
					</Grid>

					{/* customers/projects/social */}
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

					{/* selling products */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<SellingProducts />
					</Grid>

					{/* weekly stats */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<WeeklyStats isLoading={isLoading} />
					</Grid>

					{/* top performers */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<TopPerformers />
					</Grid>
				</Grid>
			</Box>
		</PageContainer>
	)
}
