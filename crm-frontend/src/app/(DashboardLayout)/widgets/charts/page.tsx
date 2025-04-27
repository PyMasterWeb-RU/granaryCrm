import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import Grid from '@mui/material/Grid'

import MonthlyEarnings from '@/app/components/dashboards/ecommerce/MonthlyEarnings'
import RevenueUpdates from '@/app/components/dashboards/ecommerce/RevenueUpdates'
import SalesOverview from '@/app/components/dashboards/ecommerce/SalesOverview'
import SalesTwo from '@/app/components/dashboards/ecommerce/SalesTwo'
import YearlySales from '@/app/components/dashboards/ecommerce/YearlySales'
import Customers from '@/app/components/dashboards/modern/Customers'
import Projects from '@/app/components/dashboards/modern/Projects'
import YearlyBreakup from '@/app/components/dashboards/modern/YearlyBreakup'
import CurrentValue from '@/app/components/widgets/charts/CurrentValue'
import Earned from '@/app/components/widgets/charts/Earned'
import Followers from '@/app/components/widgets/charts/Followers'
import MostVisited from '@/app/components/widgets/charts/MostVisited'
import PageImpressions from '@/app/components/widgets/charts/PageImpressions'
import Views from '@/app/components/widgets/charts/Views'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Charts' }]

const WidgetCharts = () => (
	<PageContainer title='Charts' description='this is Charts'>
		<Breadcrumb title='Charts' items={BCrumb} />

		<Grid container spacing={3}>
			{/* Top metrics */}
			<Grid size={{ xs: 12, sm: 3 }}>
				<Followers />
			</Grid>
			<Grid size={{ xs: 12, sm: 3 }}>
				<Views />
			</Grid>
			<Grid size={{ xs: 12, sm: 3 }}>
				<Earned />
			</Grid>
			<Grid size={{ xs: 12, sm: 3 }}>
				<SalesTwo />
			</Grid>

			{/* Current value full width */}
			<Grid size={12}>
				<CurrentValue />
			</Grid>

			{/* Left column charts */}
			<Grid size={{ xs: 12, lg: 4 }}>
				<Grid container spacing={3}>
					<Grid size={12}>
						<YearlyBreakup />
					</Grid>
					<Grid size={12}>
						<MonthlyEarnings />
					</Grid>
					<Grid size={12}>
						<MostVisited />
					</Grid>
				</Grid>
			</Grid>

			{/* Center column charts */}
			<Grid size={{ xs: 12, lg: 4 }}>
				<Grid container spacing={3}>
					<Grid size={12}>
						<YearlySales />
					</Grid>
					<Grid size={12}>
						<PageImpressions />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Customers />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Projects />
					</Grid>
				</Grid>
			</Grid>

			{/* Right column charts */}
			<Grid size={{ xs: 12, lg: 4 }}>
				<Grid container spacing={3}>
					<Grid size={12}>
						<RevenueUpdates />
					</Grid>
					<Grid size={12}>
						<SalesOverview />
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	</PageContainer>
)

export default WidgetCharts
