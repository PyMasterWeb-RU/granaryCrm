import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import Grid from '@mui/material/Grid'

import TabIcon from '@/app/components/ui-components/tab/TabIcon'
import TabIconBottom from '@/app/components/ui-components/tab/TabIconBottom'
import TabIconLabel from '@/app/components/ui-components/tab/TabIconLabel'
import TabIconLeft from '@/app/components/ui-components/tab/TabIconLeft'
import TabIconRight from '@/app/components/ui-components/tab/TabIconRight'
import TabScrollable from '@/app/components/ui-components/tab/TabScrollable'
import TabText from '@/app/components/ui-components/tab/TabText'
import TabVertical from '@/app/components/ui-components/tab/TabVertical'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Tabs' }]

const MuiTabs = () => (
	<PageContainer title='Tabs' description='this is Tabs'>
		<Breadcrumb title='Tabs' items={BCrumb} />

		<ParentCard title='Tabs'>
			<Grid container spacing={3}>
				{/* Text */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabText />
				</Grid>

				{/* Icon */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabIcon />
				</Grid>

				{/* Icon with Label */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabIconLabel />
				</Grid>

				{/* Icon Bottom */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabIconBottom />
				</Grid>

				{/* Icon Left */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabIconLeft />
				</Grid>

				{/* Icon Right */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabIconRight />
				</Grid>

				{/* Scrollable */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabScrollable />
				</Grid>

				{/* Vertical */}
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TabVertical />
				</Grid>
			</Grid>
		</ParentCard>
	</PageContainer>
)

export default MuiTabs
