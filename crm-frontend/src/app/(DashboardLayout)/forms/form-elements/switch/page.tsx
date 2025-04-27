import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'
import Grid from '@mui/material/Grid'

import ColorsSwitch from '@/app/components/forms/form-elements/switch/Colors'
import CustomExSwitch from '@/app/components/forms/form-elements/switch/Custom'
import DefaultSwitch from '@/app/components/forms/form-elements/switch/Default'
import DefaultLabelSwitch from '@/app/components/forms/form-elements/switch/DefaultLabel'
import PositionSwitch from '@/app/components/forms/form-elements/switch/Position'
import SizesSwitch from '@/app/components/forms/form-elements/switch/Sizes'

import ColorsSwitchCode from '@/app/components/forms/form-elements/switch/code/ColorsSwitchCode'
import CustomSwitchCode from '@/app/components/forms/form-elements/switch/code/CustomSwitchCode'
import DefaultLabelSwitchCode from '@/app/components/forms/form-elements/switch/code/DefaultLabelSwitchCode'
import DefaultSwitchCode from '@/app/components/forms/form-elements/switch/code/DefaultSwitchCode'
import PositionSwitchCode from '@/app/components/forms/form-elements/switch/code/PositionSwitchCode'
import SizesSwitchCode from '@/app/components/forms/form-elements/switch/code/SizesSwitchCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Switch' }]

const MuiSwitch = () => (
	<PageContainer title='Switch' description='this is Switch'>
		<Breadcrumb title='Switch' items={BCrumb} />
		<ParentCard title='Switch'>
			<Grid container spacing={3}>
				{/* Custom */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 6 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Custom' codeModel={<CustomSwitchCode />}>
						<CustomExSwitch />
					</ChildCard>
				</Grid>

				{/* Default */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 6 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Default' codeModel={<DefaultSwitchCode />}>
						<DefaultSwitch />
					</ChildCard>
				</Grid>

				{/* Default with Label */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 6 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard
						title='Default with Label'
						codeModel={<DefaultLabelSwitchCode />}
					>
						<DefaultLabelSwitch />
					</ChildCard>
				</Grid>

				{/* Sizes */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 6 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Sizes' codeModel={<SizesSwitchCode />}>
						<SizesSwitch />
					</ChildCard>
				</Grid>

				{/* Default Colors */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 6 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Default Colors' codeModel={<ColorsSwitchCode />}>
						<ColorsSwitch />
					</ChildCard>
				</Grid>

				{/* Placement */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 6 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Placement' codeModel={<PositionSwitchCode />}>
						<PositionSwitch />
					</ChildCard>
				</Grid>
			</Grid>
		</ParentCard>
	</PageContainer>
)

export default MuiSwitch
