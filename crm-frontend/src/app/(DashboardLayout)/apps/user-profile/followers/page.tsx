import FollowerCard from '@/app/components/apps/userprofile/followers/FollowerCard'
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner'
import PageContainer from '@/app/components/container/PageContainer'
import Grid from '@mui/material/Grid'

const Followers = () => {
	return (
		<PageContainer title='Followers' description='this is Followers'>
			<Grid container spacing={3}>
				<Grid size={12}>
					<ProfileBanner />
				</Grid>
				<Grid size={12}>
					<FollowerCard />
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default Followers
