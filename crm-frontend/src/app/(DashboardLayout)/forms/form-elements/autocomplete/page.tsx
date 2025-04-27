import { Grid } from '@mui/material'

import CheckboxesAutocomplete from '@/app/components/forms/form-elements/autoComplete/CheckboxesAutocomplete'
import ComboBoxAutocomplete from '@/app/components/forms/form-elements/autoComplete/ComboBoxAutocomplete'
import ControlledStateAutocomplete from '@/app/components/forms/form-elements/autoComplete/ControlledStateAutocomplete'
import CountrySelectAutocomplete from '@/app/components/forms/form-elements/autoComplete/CountrySelectAutocomplete'
import FreeSoloAutocomplete from '@/app/components/forms/form-elements/autoComplete/FreeSoloAutocomplete'
import MultipleValuesAutocomplete from '@/app/components/forms/form-elements/autoComplete/MultipleValuesAutocomplete'
import SizesAutocomplete from '@/app/components/forms/form-elements/autoComplete/SizesAutocomplete'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'

// codeModel
import CheckboxesCode from '@/app/components/forms/form-elements/autoComplete/code/CheckboxesCode'
import ComboBoxCode from '@/app/components/forms/form-elements/autoComplete/code/ComboBoxCode'
import ControlledStateCode from '@/app/components/forms/form-elements/autoComplete/code/ControlledStateCode'
import CountrySelectCode from '@/app/components/forms/form-elements/autoComplete/code/CountrySelectCode'
import FreeSoloCode from '@/app/components/forms/form-elements/autoComplete/code/FreeSoloCode'
import MultipleValuesCode from '@/app/components/forms/form-elements/autoComplete/code/MultipleValuesCode'
import SizesCode from '@/app/components/forms/form-elements/autoComplete/code/SizesCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'AutoComplete' }]

const MuiAutoComplete = () => (
	<PageContainer title='Autocomplete' description='this is Autocomplete'>
		{/* breadcrumb */}
		<Breadcrumb title='AutoComplete' items={BCrumb} />

		<ParentCard title='Autocomplete'>
			<Grid container spacing={3}>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Combo Box' codeModel={<ComboBoxCode />}>
						<ComboBoxAutocomplete />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Country Select' codeModel={<CountrySelectCode />}>
						<CountrySelectAutocomplete />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard
						title='Controlled State'
						codeModel={<ControlledStateCode />}
					>
						<ControlledStateAutocomplete />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Free Solo' codeModel={<FreeSoloCode />}>
						<FreeSoloAutocomplete />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Multiple Values' codeModel={<MultipleValuesCode />}>
						<MultipleValuesAutocomplete />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Checkboxes' codeModel={<CheckboxesCode />}>
						<CheckboxesAutocomplete />
					</ChildCard>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Sizes' codeModel={<SizesCode />}>
						<SizesAutocomplete />
					</ChildCard>
				</Grid>
			</Grid>
		</ParentCard>
	</PageContainer>
)

export default MuiAutoComplete
