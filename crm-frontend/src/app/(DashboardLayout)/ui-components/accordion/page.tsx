import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import Basic from '@/app/components/ui-components/accordion/Basic'
import Controlled from '@/app/components/ui-components/accordion/Controlled'
import Grid from '@mui/material/Grid'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Accordion' }]

const MuiAccordion = () => {
	return (
		<PageContainer title='Accordion' description='this is Accordion'>
			<Breadcrumb title='Accordion' items={BCrumb} />

			<ParentCard title='Accordion'>
				<Grid container spacing={3}>
					<Grid size={12} display='flex' alignItems='stretch'>
						<Basic />
					</Grid>
					<Grid size={12} display='flex' alignItems='stretch'>
						<Controlled />
					</Grid>
				</Grid>
			</ParentCard>
		</PageContainer>
	)
}

export default MuiAccordion
