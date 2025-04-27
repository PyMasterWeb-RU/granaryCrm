import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import Questions from '@/app/components/pages/faq/Questions'
import StillQuestions from '@/app/components/pages/faq/StillQuestions'
import Grid from '@mui/material/Grid'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'FAQ' }]

const Faq = () => (
	<PageContainer title='FAQ' description='this is FAQ'>
		<Breadcrumb title='FAQ' items={BCrumb} />

		<Grid container spacing={3}>
			<Grid size={12}>
				<Questions />
				<StillQuestions />
			</Grid>
		</Grid>
	</PageContainer>
)

export default Faq
