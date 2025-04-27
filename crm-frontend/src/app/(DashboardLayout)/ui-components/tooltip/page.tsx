'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import Grid from '@mui/material/Grid'

import TooltipArrow from '@/app/components/ui-components/tooltip/TooltipArrow'
import TooltipPosition from '@/app/components/ui-components/tooltip/TooltipPosition'
import TooltipSimple from '@/app/components/ui-components/tooltip/TooltipSimple'
import TooltipTransition from '@/app/components/ui-components/tooltip/TooltipTransition'
import TooltipVariableWidth from '@/app/components/ui-components/tooltip/TooltipVariableWidth'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Tooltip' }]

const MuiTooltip = () => (
	<PageContainer title='Tooltip' description='this is Tooltip'>
		<Breadcrumb title='Tooltip' items={BCrumb} />

		<ParentCard title='Tooltip'>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TooltipSimple />
				</Grid>

				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TooltipArrow />
				</Grid>

				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TooltipVariableWidth />
				</Grid>

				<Grid size={{ xs: 12, sm: 6 }} display='flex' alignItems='stretch'>
					<TooltipTransition />
				</Grid>

				<Grid size={{ xs: 12 }} display='flex' alignItems='stretch'>
					<TooltipPosition />
				</Grid>
			</Grid>
		</ParentCard>
	</PageContainer>
)

export default MuiTooltip
