import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'
import Grid from '@mui/material/Grid'

// custom components
import ColorsCheckbox from '@/app/components/forms/form-elements/checkbox/Colors'
import CustomEleCheckbox from '@/app/components/forms/form-elements/checkbox/Custom'
import DefaultCheckbox from '@/app/components/forms/form-elements/checkbox/Default'
import DefaultcolorsCheckbox from '@/app/components/forms/form-elements/checkbox/DefaultColors'
import PositionCheckbox from '@/app/components/forms/form-elements/checkbox/Position'
import SizesCheckbox from '@/app/components/forms/form-elements/checkbox/Sizes'

// codeModel
import ColorsCheckboxCode from '@/app/components/forms/form-elements/checkbox/code/ColorsCheckboxCode'
import CustomEleCheckboxCode from '@/app/components/forms/form-elements/checkbox/code/CustomEleCheckboxCode'
import DefaultCheckboxCode from '@/app/components/forms/form-elements/checkbox/code/DefaultCheckboxCode'
import DefaultcolorsCheckboxCode from '@/app/components/forms/form-elements/checkbox/code/DefaultcolorsCheckboxCode'
import PositionCheckboxCode from '@/app/components/forms/form-elements/checkbox/code/PositionCheckboxCode'
import SizesCheckboxCode from '@/app/components/forms/form-elements/checkbox/code/SizesCheckboxCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Checkbox' }]

const MuiCheckbox = () => {
	return (
		<PageContainer title='Checkbox' description='this is Checkbox'>
			<Breadcrumb title='Checkbox' items={BCrumb} />

			<ParentCard title='Checkbox'>
				<Grid container spacing={3}>
					{/* Custom */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Custom' codeModel={<CustomEleCheckboxCode />}>
							<CustomEleCheckbox />
						</ChildCard>
					</Grid>

					{/* Colors */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Colors' codeModel={<ColorsCheckboxCode />}>
							<ColorsCheckbox />
						</ChildCard>
					</Grid>

					{/* Default */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Default' codeModel={<DefaultCheckboxCode />}>
							<DefaultCheckbox />
						</ChildCard>
					</Grid>

					{/* Default with Colors */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard
							title='Default with Colors'
							codeModel={<DefaultcolorsCheckboxCode />}
						>
							<DefaultcolorsCheckbox />
						</ChildCard>
					</Grid>

					{/* Sizes & Custom Icon */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard
							title='Sizes & Custom Icon'
							codeModel={<SizesCheckboxCode />}
						>
							<SizesCheckbox />
						</ChildCard>
					</Grid>

					{/* Position */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Position' codeModel={<PositionCheckboxCode />}>
							<PositionCheckbox />
						</ChildCard>
					</Grid>
				</Grid>
			</ParentCard>
		</PageContainer>
	)
}

export default MuiCheckbox
