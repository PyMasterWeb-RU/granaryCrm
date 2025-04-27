import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'
import Grid from '@mui/material/Grid'

import ColorLabelRadio from '@/app/components/forms/form-elements/radio/ColorLabel'
import ColorsRadio from '@/app/components/forms/form-elements/radio/Colors'
import CustomExRadio from '@/app/components/forms/form-elements/radio/Custom'
import DefaultRadio from '@/app/components/forms/form-elements/radio/Default'
import PositionRadio from '@/app/components/forms/form-elements/radio/Position'
import SizesRadio from '@/app/components/forms/form-elements/radio/Sizes'

// codeModel
import ColorLabelRadioCode from '@/app/components/forms/form-elements/radio/code/ColorLabelRadioCode'
import ColorsRadioCode from '@/app/components/forms/form-elements/radio/code/ColorsRadioCode'
import CustomExRadioCode from '@/app/components/forms/form-elements/radio/code/CustomExRadioCode'
import DefaultRadioCode from '@/app/components/forms/form-elements/radio/code/DefaultRadioCode'
import PositionRadioCode from '@/app/components/forms/form-elements/radio/code/PositionRadioCode'
import SizesRadioCode from '@/app/components/forms/form-elements/radio/code/SizesRadioCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Radio' }]

const ExRadio = () => {
	return (
		<PageContainer title='Radio' description='this is Radio'>
			<Breadcrumb title='Radio' items={BCrumb} />

			<ParentCard title='Radio'>
				<Grid container spacing={3}>
					{/* Custom */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Custom' codeModel={<CustomExRadioCode />}>
							<CustomExRadio />
						</ChildCard>
					</Grid>

					{/* Color with Label */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard
							title='Color with Label'
							codeModel={<ColorLabelRadioCode />}
						>
							<ColorLabelRadio />
						</ChildCard>
					</Grid>

					{/* Default */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Default' codeModel={<DefaultRadioCode />}>
							<DefaultRadio />
						</ChildCard>
					</Grid>

					{/* Default Colors */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Default Colors' codeModel={<ColorsRadioCode />}>
							<ColorsRadio />
						</ChildCard>
					</Grid>

					{/* Sizes */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Sizes' codeModel={<SizesRadioCode />}>
							<SizesRadio />
						</ChildCard>
					</Grid>

					{/* Position */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 6 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Position' codeModel={<PositionRadioCode />}>
							<PositionRadio />
						</ChildCard>
					</Grid>
				</Grid>
			</ParentCard>
		</PageContainer>
	)
}

export default ExRadio
