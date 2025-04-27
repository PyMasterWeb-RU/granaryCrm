import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'
import Grid from '@mui/material/Grid'

import ColorButtons from '@/app/components/forms/form-elements/button/ColorButtons'
import DefaultButtons from '@/app/components/forms/form-elements/button/DefaultButtons'
import IconLoadingButtons from '@/app/components/forms/form-elements/button/IconLoadingButtons'
import SizeButton from '@/app/components/forms/form-elements/button/SizeButton'

import OutlinedIconButtons from '@/app/components/forms/form-elements/button/OutlinedIconButtons'
import OutlinedSizeButton from '@/app/components/forms/form-elements/button/OutlinedSizeButton'

import TextColorButtons from '@/app/components/forms/form-elements/button/TextColorButtons'
import TextDefaultButtons from '@/app/components/forms/form-elements/button/TextDefaultButtons'
import TextIconButtons from '@/app/components/forms/form-elements/button/TextIconButtons'
import TextSizeButton from '@/app/components/forms/form-elements/button/TextSizeButton'

import IconColorButtons from '@/app/components/forms/form-elements/button/IconColorButtons'
import IconSizeButtons from '@/app/components/forms/form-elements/button/IconSizeButtons'

import FabColorButtons from '@/app/components/forms/form-elements/button/FabColorButtons'
import FabDefaultButton from '@/app/components/forms/form-elements/button/FabDefaultButton'
import FabSizeButtons from '@/app/components/forms/form-elements/button/FabSizeButtons'

import ColorButtonGroup from '@/app/components/forms/form-elements/button/ColorButtonGroup'
import DefaultButtonGroup from '@/app/components/forms/form-elements/button/DefaultButtonGroup'
import SizeButtonGroup from '@/app/components/forms/form-elements/button/SizeButtonGroup'
import TextButtonGroup from '@/app/components/forms/form-elements/button/TextButtonGroup'
import VerticalButtonGroup from '@/app/components/forms/form-elements/button/VerticalButtonGroup'

import ColorButtonGroupCode from '@/app/components/forms/form-elements/button/code/ColorButtonGroupCode'
import ColorsCode from '@/app/components/forms/form-elements/button/code/ColorsCode'
import DefaultButtonGroupCode from '@/app/components/forms/form-elements/button/code/DefaultButtonGroupCode'
import DefaultCode from '@/app/components/forms/form-elements/button/code/DefaultCode'
import FABCode from '@/app/components/forms/form-elements/button/code/FABCode'
import FABColorCode from '@/app/components/forms/form-elements/button/code/FABColorCode'
import FABSizeCode from '@/app/components/forms/form-elements/button/code/FABSizeCode'
import IconColorCode from '@/app/components/forms/form-elements/button/code/IconColorCode'
import IconSizesCode from '@/app/components/forms/form-elements/button/code/IconSizesCode'
import LoadingButtonsCode from '@/app/components/forms/form-elements/button/code/LoadingButtonsCode'
import OutlinedCode from '@/app/components/forms/form-elements/button/code/OutlinedCode'
import OutlinedIconCode from '@/app/components/forms/form-elements/button/code/OutlinedIconCode'
import OutlineSizeCode from '@/app/components/forms/form-elements/button/code/OutlineSizeCode'
import SizeButtonGroupCode from '@/app/components/forms/form-elements/button/code/SizeButtonGroupCode'
import SizesCode from '@/app/components/forms/form-elements/button/code/SizesCode'
import TextButtonGroupCode from '@/app/components/forms/form-elements/button/code/TextButtonGroupCode'
import TextCode from '@/app/components/forms/form-elements/button/code/TextCode'
import TextColorCode from '@/app/components/forms/form-elements/button/code/TextColorCode'
import TextIconColor from '@/app/components/forms/form-elements/button/code/TextIconColor'
import TextSizesCode from '@/app/components/forms/form-elements/button/code/TextSizesCode'
import VerticalButtonGroupCode from '@/app/components/forms/form-elements/button/code/VerticalButtonGroupCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Button' }]

const MuiButton = () => (
	<PageContainer title='Button' description='this is Button'>
		<Breadcrumb title='Button' items={BCrumb} />

		<Grid container spacing={3}>
			<Grid size={12}>
				<ParentCard title='Buttons'>
					<Grid container spacing={3}>
						{/* row 1 */}
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Default' codeModel={<DefaultCode />}>
								<DefaultButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Colors' codeModel={<ColorsCode />}>
								<ColorButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard
								title='Loading Buttons'
								codeModel={<LoadingButtonsCode />}
							>
								<IconLoadingButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Sizes' codeModel={<SizesCode />}>
								<SizeButton />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Outlined' codeModel={<OutlinedCode />}>
								<OutlinedIconButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Outlined Icon' codeModel={<OutlinedIconCode />}>
								<OutlinedIconButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Outline Size' codeModel={<OutlineSizeCode />}>
								<OutlinedSizeButton />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Text' codeModel={<TextCode />}>
								<TextDefaultButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Text Color' codeModel={<TextColorCode />}>
								<TextColorButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Text Icon' codeModel={<TextIconColor />}>
								<TextIconButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Text Sizes' codeModel={<TextSizesCode />}>
								<TextSizeButton />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Icon Color' codeModel={<IconColorCode />}>
								<IconColorButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Icon Sizes' codeModel={<IconSizesCode />}>
								<IconSizeButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='FAB' codeModel={<FABCode />}>
								<FabDefaultButton />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='FAB Color' codeModel={<FABColorCode />}>
								<FabColorButtons />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='FAB Size' codeModel={<FABSizeCode />}>
								<FabSizeButtons />
							</ChildCard>
						</Grid>
					</Grid>
				</ParentCard>
			</Grid>

			<Grid size={12}>
				<ParentCard title='Button Group'>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Default' codeModel={<DefaultButtonGroupCode />}>
								<DefaultButtonGroup />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Sizes' codeModel={<SizeButtonGroupCode />}>
								<SizeButtonGroup />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard
								title='Vertical'
								codeModel={<VerticalButtonGroupCode />}
							>
								<VerticalButtonGroup />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12, lg: 6 }} display='flex' alignItems='stretch'>
							<ChildCard title='Text' codeModel={<TextButtonGroupCode />}>
								<TextButtonGroup />
							</ChildCard>
						</Grid>
						<Grid size={{ xs: 12 }} display='flex' alignItems='stretch'>
							<ChildCard title='Color' codeModel={<ColorButtonGroupCode />}>
								<ColorButtonGroup />
							</ChildCard>
						</Grid>
					</Grid>
				</ParentCard>
			</Grid>
		</Grid>
	</PageContainer>
)

export default MuiButton
