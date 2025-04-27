import PageContainer from '@/app/components/container/PageContainer'
import Grid from '@mui/material/Grid'

import IntroCard from '@/app/components/apps/userprofile/profile/IntroCard'
import PhotosCard from '@/app/components/apps/userprofile/profile/PhotosCard'
import Post from '@/app/components/apps/userprofile/profile/Post'
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner'

const UserProfile = () => {
	return (
		<PageContainer title='Profile' description='this is Profile'>
			<Grid container spacing={3}>
				{/* banner */}
				<Grid size={12}>
					<ProfileBanner />
				</Grid>

				{/* intro and photos */}
				<Grid size={{ xs: 12, lg: 4 }}>
					<Grid container spacing={3}>
						<Grid size={12}>
							<IntroCard />
						</Grid>
						<Grid size={12}>
							<PhotosCard />
						</Grid>
					</Grid>
				</Grid>

				{/* posts */}
				<Grid size={{ xs: 12, lg: 8 }}>
					<Post />
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default UserProfile
