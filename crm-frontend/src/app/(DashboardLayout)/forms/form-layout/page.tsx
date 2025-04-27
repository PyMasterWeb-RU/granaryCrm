import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import Grid from '@mui/material/Grid'

import {
	FbBasicHeaderForm,
	FbDefaultForm,
	FbDisabledForm,
	FbInputVariants,
	FbLeftIconForm,
	FbOrdinaryForm,
	FbReadonlyForm,
	FbRightIconForm,
} from '@/app/components/forms/form-layouts'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Form Layouts' }]

const FormLayouts = () => (
	<PageContainer title='Form Layout' description='this is Form Layout'>
		<Breadcrumb title='Form Layouts' items={BCrumb} />

		<Grid container spacing={3}>
			<Grid size={{ xs: 12, md: 12, lg: 12 }}>
				<FbOrdinaryForm />
			</Grid>
			<Grid size={{ xs: 12, md: 12, lg: 12 }}>
				<FbInputVariants />
			</Grid>
			<Grid size={{ xs: 12, md: 12, lg: 12 }}>
				<FbDefaultForm />
			</Grid>
			<Grid size={{ xs: 12, md: 12, lg: 12 }}>
				<FbBasicHeaderForm />
			</Grid>
			<Grid size={{ xs: 12, md: 12, lg: 12 }}>
				<FbReadonlyForm />
			</Grid>
			<Grid size={{ xs: 12, md: 12, lg: 12 }}>
				<FbDisabledForm />
			</Grid>
			<Grid size={{ xs: 12, md: 12, lg: 6 }}>
				<FbLeftIconForm />
			</Grid>
			<Grid size={{ xs: 12, md: 12, lg: 6 }}>
				<FbRightIconForm />
			</Grid>
		</Grid>
	</PageContainer>
)

export default FormLayouts
