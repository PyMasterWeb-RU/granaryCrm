'use client'

import Grid from '@mui/material/Grid'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'

import Controlled from '@/app/components/ui-components/rating/Controlled'
import CustomIconSet from '@/app/components/ui-components/rating/CustomIconSet'
import Disabled from '@/app/components/ui-components/rating/Disabled'
import HoverFeedback from '@/app/components/ui-components/rating/HoverFeedback'
import NoRating from '@/app/components/ui-components/rating/NoRating'
import RadioGroup from '@/app/components/ui-components/rating/RadioGroup'
import ReadOnly from '@/app/components/ui-components/rating/ReadOnly'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Rating' }]

const MuiRating = () => (
	<PageContainer title='Rating' description='this is Rating'>
		<Breadcrumb title='Rating' items={BCrumb} />

		<ParentCard title='Rating'>
			<Grid container spacing={3}>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<Controlled />
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ReadOnly />
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<Disabled />
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<NoRating />
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Rating precision'>
						<Rating name='half-rating' defaultValue={2.5} precision={0.5} />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<HoverFeedback />
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<CustomIconSet />
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='10 Stars'>
						<Rating name='customized-10' defaultValue={2} max={10} />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<RadioGroup />
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Sizes'>
						<Stack spacing={2}>
							<Rating name='size-small' defaultValue={2} size='small' />
							<Rating name='size-medium' defaultValue={2} />
							<Rating name='size-large' defaultValue={2} size='large' />
						</Stack>
					</ChildCard>
				</Grid>
			</Grid>
		</ParentCard>
	</PageContainer>
)

export default MuiRating
