'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import CustomSlider from '@/app/components/forms/theme-elements/CustomSlider'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import { IconVolume, IconVolume2 } from '@tabler/icons-react'

import DiscreteSlider from '@/app/components/forms/form-elements/slider/DiscreteSlider'
import RangeDefault from '@/app/components/forms/form-elements/slider/RangeDefault'
import RangeSlider from '@/app/components/forms/form-elements/slider/RangeSlider'
import VolumeSlider from '@/app/components/forms/form-elements/slider/VolumeSlider'

import CustomSliderCode from '@/app/components/forms/form-elements/slider/code/CustomSliderCode'
import DefaultsliderCode from '@/app/components/forms/form-elements/slider/code/DefaultsliderCode'
import DisabledSliderCode from '@/app/components/forms/form-elements/slider/code/DisabledSliderCode'
import VolumesliderCode from '@/app/components/forms/form-elements/slider/code/VolumesliderCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Slider' }]

const MuiSlider = () => {
	return (
		<PageContainer title='Slider' description='this is Slider'>
			<Breadcrumb title='Slider' items={BCrumb} />
			<ParentCard title='Slider'>
				<Grid container spacing={3}>
					{/* Custom */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Custom' codeModel={<CustomSliderCode />}>
							<CustomSlider defaultValue={[30]} />
						</ChildCard>
					</Grid>

					{/* Volume */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Volume' codeModel={<VolumesliderCode />}>
							<CustomSlider defaultValue={30} aria-label='volume slider' />
							<Box display='flex' alignItems='center'>
								<Typography>
									<IconVolume2 width={20} />
								</Typography>
								<Box ml='auto'>
									<Typography>
										<IconVolume width={20} />
									</Typography>
								</Box>
							</Box>
						</ChildCard>
					</Grid>

					{/* Range Default */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<RangeDefault />
					</Grid>

					{/* Default */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Default' codeModel={<DefaultsliderCode />}>
							<Slider defaultValue={30} />
						</ChildCard>
					</Grid>

					{/* Disabled */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<ChildCard title='Disabled' codeModel={<DisabledSliderCode />}>
							<Slider disabled defaultValue={30} />
						</ChildCard>
					</Grid>

					{/* Volume Slider */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<VolumeSlider />
					</Grid>

					{/* Discrete Slider */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<DiscreteSlider />
					</Grid>

					{/* Range Slider */}
					<Grid
						size={{ xs: 12, sm: 6, lg: 4 }}
						display='flex'
						alignItems='stretch'
					>
						<RangeSlider />
					</Grid>
				</Grid>
			</ParentCard>
		</PageContainer>
	)
}

export default MuiSlider
