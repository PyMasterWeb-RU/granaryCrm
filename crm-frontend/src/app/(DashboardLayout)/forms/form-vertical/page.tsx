import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import BasicIcons from '@/app/components/forms/form-vertical/BasicIcons'
import BasicLayout from '@/app/components/forms/form-vertical/BasicLayout'
import CollapsibleForm from '@/app/components/forms/form-vertical/CollapsibleForm'
import FormSeparator from '@/app/components/forms/form-vertical/FormSeparator'
import FormTabs from '@/app/components/forms/form-vertical/FormTabs'

import BasicIconsCode from '@/app/components/forms/form-vertical/code/BasicIconsCode'
import BasicLayoutCode from '@/app/components/forms/form-vertical/code/BasicLayoutCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Vertical Form' }]

const FormVertical = () => {
	return (
		<PageContainer title='Form Vertical' description='this is Form Vertical'>
			<Breadcrumb title='Vertical Form' items={BCrumb} />

			<Grid container spacing={3}>
				{/* Basic Layout */}
				<Grid size={{ xs: 12, lg: 6 }}>
					<ParentCard title='Basic Layout' codeModel={<BasicLayoutCode />}>
						<BasicLayout />
					</ParentCard>
				</Grid>

				{/* Basic with Icons */}
				<Grid size={{ xs: 12, lg: 6 }}>
					<ParentCard title='Basic with Icons' codeModel={<BasicIconsCode />}>
						<BasicIcons />
					</ParentCard>
				</Grid>

				{/* Multi Column with Separator */}
				<Grid size={12}>
					<ParentCard title='Multi Column with Form Separator'>
						<FormSeparator />
					</ParentCard>
				</Grid>

				{/* Collapsible Section */}
				<Grid size={12}>
					<Typography variant='h5' mb={3}>
						Collapsible Section
					</Typography>
					<CollapsibleForm />
				</Grid>

				{/* Form with Tabs */}
				<Grid size={12}>
					<Typography variant='h5' mb={3}>
						Form with Tabs
					</Typography>
					<FormTabs />
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default FormVertical
