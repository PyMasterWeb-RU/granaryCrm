import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo'
import PageContainer from '@/app/components/container/PageContainer'
import BlankCard from '@/app/components/shared/BlankCard'
import ChildCard from '@/app/components/shared/ChildCard'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import FVCheckbox from '@/app/components/forms/form-validation/FVCheckbox'
import FVLogin from '@/app/components/forms/form-validation/FVLogin'
import FVOnLeave from '@/app/components/forms/form-validation/FVOnLeave'
import FVRadio from '@/app/components/forms/form-validation/FVRadio'
import FVRegister from '@/app/components/forms/form-validation/FVRegister'
import FVSelect from '@/app/components/forms/form-validation/FVSelect'

import CheckboxCode from '@/app/components/forms/form-validation/code/CheckboxCode'
import OnLeaveCode from '@/app/components/forms/form-validation/code/OnLeaveCode'
import RadioCode from '@/app/components/forms/form-validation/code/RadioCode'
import SelectCode from '@/app/components/forms/form-validation/code/SelectCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Form Validation' }]

const FormValidation = () => (
	<PageContainer title='Form Validation' description='this is Form Validation'>
		<Breadcrumb title='Form Validation' items={BCrumb} />

		<Grid container spacing={3}>
			{/* Register */}
			<Grid size={{ xs: 12, sm: 6 }}>
				<BlankCard>
					<CardContent sx={{ pt: 0 }}>
						<Logo />
						<FVRegister />
					</CardContent>
				</BlankCard>
			</Grid>

			{/* Login */}
			<Grid size={{ xs: 12, sm: 6 }}>
				<BlankCard>
					<CardContent sx={{ pt: 0 }}>
						<Logo />
						<FVLogin />
					</CardContent>
				</BlankCard>
			</Grid>

			{/* On Leave */}
			<Grid size={{ xs: 12, sm: 6 }}>
				<ChildCard title='On Leave' codeModel={<OnLeaveCode />}>
					<FVOnLeave />
				</ChildCard>
			</Grid>

			{/* Select */}
			<Grid size={{ xs: 12, sm: 6 }}>
				<ChildCard title='Select' codeModel={<SelectCode />}>
					<FVSelect />
				</ChildCard>
			</Grid>

			{/* Radio */}
			<Grid size={{ xs: 12, sm: 6 }}>
				<ChildCard title='Radio' codeModel={<RadioCode />}>
					<FVRadio />
				</ChildCard>
			</Grid>

			{/* Checkboxes */}
			<Grid size={{ xs: 12, sm: 6 }}>
				<ChildCard title='Checkboxes' codeModel={<CheckboxCode />}>
					<FVCheckbox />
				</ChildCard>
			</Grid>
		</Grid>
	</PageContainer>
)

export default FormValidation
