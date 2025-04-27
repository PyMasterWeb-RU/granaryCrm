import GalleryCard from '@/app/components/apps/userprofile/gallery/GalleryCard'
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner'
import PageContainer from '@/app/components/container/PageContainer'
import Grid from '@mui/material/Grid'

const Gallery = () => {
	return (
		<PageContainer title='Gallery' description='this is Gallery'>
			<Grid container spacing={3}>
				<Grid size={12}>
					<ProfileBanner />
				</Grid>
				<Grid size={12}>
					<GalleryCard />
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default Gallery
