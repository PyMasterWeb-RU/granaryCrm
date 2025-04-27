import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Badge from '@mui/material/Badge'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { IconMoodSmile } from '@tabler/icons-react'

import GroupedCode from '@/app/components/ui-components/avatar/code/GroupedCode'
import GroupedSizeCode from '@/app/components/ui-components/avatar/code/GroupedSizeCode'
import IconAvatarsCode from '@/app/components/ui-components/avatar/code/IconAvatarsCode'
import ImageAvatarsCode from '@/app/components/ui-components/avatar/code/ImageAvatarsCode'
import LetterAvatarsCode from '@/app/components/ui-components/avatar/code/LetterAvatarsCode'
import SizesCode from '@/app/components/ui-components/avatar/code/SizesCode'
import VariantCode from '@/app/components/ui-components/avatar/code/VariantCode'
import WithBadgeCode from '@/app/components/ui-components/avatar/code/WithBadgeCode'

// вместо as const
const BCrumb: { to?: string; title: string }[] = [
	{ to: '/', title: 'Home' },
	{ title: 'Avatar' },
]

// Explicitly type the badge colors so TS knows they match BadgeProps.color
const badgeColors: Array<'success' | 'warning' | 'error'> = [
	'success',
	'warning',
	'error',
]

const MuiAvatar = () => (
	<PageContainer title='Avatar' description='this is Avatar'>
		<Breadcrumb title='Avatar' items={BCrumb} />

		<ParentCard title='Avatar'>
			<Grid container spacing={3}>
				{/* Image avatars */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Image avatars' codeModel={<ImageAvatarsCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<Avatar alt='Remy Sharp' src='/images/profile/user-4.jpg' />
							<Avatar alt='Travis Howard' src='/images/profile/user-2.jpg' />
							<Avatar alt='Cindy Baker' src='/images/profile/user-3.jpg' />
						</Stack>
					</ChildCard>
				</Grid>

				{/* Letter avatars */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Letter avatars' codeModel={<LetterAvatarsCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
							<Avatar sx={{ bgcolor: 'secondary.main' }}>B</Avatar>
							<Avatar sx={{ bgcolor: 'error.main' }}>C</Avatar>
							<Avatar sx={{ bgcolor: 'warning.main' }}>D</Avatar>
							<Avatar sx={{ bgcolor: 'success.main' }}>E</Avatar>
						</Stack>
					</ChildCard>
				</Grid>

				{/* Icon avatars */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Icon avatars' codeModel={<IconAvatarsCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							{(
								['primary', 'secondary', 'error', 'warning', 'success'] as const
							).map(color => (
								<Avatar key={color} sx={{ bgcolor: `${color}.main` as const }}>
									<IconMoodSmile width={24} />
								</Avatar>
							))}
						</Stack>
					</ChildCard>
				</Grid>

				{/* Variant */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Variant' codeModel={<VariantCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<Avatar sx={{ bgcolor: 'primary.main' }}>
								<IconMoodSmile width={24} />
							</Avatar>
							<Avatar sx={{ bgcolor: 'primary.main' }} variant='square'>
								<IconMoodSmile width={24} />
							</Avatar>
							<Avatar sx={{ bgcolor: 'primary.main' }} variant='rounded'>
								<IconMoodSmile width={24} />
							</Avatar>
						</Stack>
					</ChildCard>
				</Grid>

				{/* Grouped */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Grouped' codeModel={<GroupedCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<AvatarGroup max={4}>
								<Avatar alt='Remy Sharp' src='/images/profile/user-4.jpg' />
								<Avatar alt='Travis Howard' src='/images/profile/user-2.jpg' />
								<Avatar alt='Cindy Baker' src='/images/profile/user-3.jpg' />
							</AvatarGroup>
						</Stack>
					</ChildCard>
				</Grid>

				{/* Grouped Size */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Grouped Size' codeModel={<GroupedSizeCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<AvatarGroup max={4}>
								{['user-4', 'user-2', 'user-3'].map(u => (
									<Avatar
										key={u}
										alt={u}
										src={`/images/profile/${u}.jpg`}
										sx={{ width: 56, height: 56 }}
									/>
								))}
							</AvatarGroup>
						</Stack>
					</ChildCard>
				</Grid>

				{/* With Badge */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 4 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='With Badge' codeModel={<WithBadgeCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							<AvatarGroup>
								<Badge
									overlap='circular'
									anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
									badgeContent={
										<Avatar
											sx={{ width: 22, height: 22 }}
											src='/images/profile/user-4.jpg'
										/>
									}
								>
									<Avatar src='/images/profile/user-2.jpg' />
								</Badge>

								{(['user-3', 'user-4', 'user-5'] as const).map((u, i) => (
									<Badge
										key={u}
										overlap='circular'
										anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
										variant='dot'
										color={badgeColors[i]}
									>
										<Avatar src={`/images/profile/${u}.jpg`} />
									</Badge>
								))}
							</AvatarGroup>
						</Stack>
					</ChildCard>
				</Grid>

				{/* Sizes */}
				<Grid
					size={{ xs: 12, sm: 6, lg: 8 }}
					display='flex'
					alignItems='stretch'
				>
					<ChildCard title='Sizes' codeModel={<SizesCode />}>
						<Stack direction='row' spacing={1} justifyContent='center'>
							{[24, 32, 40, 50, 60, 65].map((size, i) => (
								<Avatar
									key={i}
									src={`/images/profile/user-${i + 2}.jpg`}
									sx={{ width: size, height: size }}
								/>
							))}
						</Stack>
					</ChildCard>
				</Grid>
			</Grid>
		</ParentCard>
	</PageContainer>
)

export default MuiAvatar
