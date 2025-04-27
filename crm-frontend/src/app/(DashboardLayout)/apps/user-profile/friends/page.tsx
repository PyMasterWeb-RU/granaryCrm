import FriendsCard from '@/app/components/apps/userprofile/friends/FriendsCard'
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner'
import PageContainer from '@/app/components/container/PageContainer'
import Grid from '@mui/material/Grid'

const Friends = () => {
	return (
		<PageContainer title='Friends' description='this is Friends'>
			<Grid container spacing={3}>
				<Grid size={12}>
					<ProfileBanner />
				</Grid>
				<Grid size={12}>
					<FriendsCard />
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default Friends
