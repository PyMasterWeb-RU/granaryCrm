'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import ProductDetail from '@/app/components/apps/ecommerce/productDetail'
import ProductCarousel from '@/app/components/apps/ecommerce/productDetail/ProductCarousel'
import ProductDesc from '@/app/components/apps/ecommerce/productDetail/ProductDesc'
import ProductRelated from '@/app/components/apps/ecommerce/productDetail/ProductRelated'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import Grid from '@mui/material/Grid'

const BCrumb = [
	{ to: '/', title: 'Home' },
	{ to: '/apps/ecommerce/shop', title: 'Shop' },
	{ title: 'detail' },
]

const EcommerceDetail = () => {
	return (
		<PageContainer
			title='eCommerce Detail'
			description='this is eCommerce Detail'
		>
			{/* breadcrumb */}
			<Breadcrumb title='Product Detail' items={BCrumb} />

			<Grid
				container
				spacing={3}
				sx={{ maxWidth: { lg: '1055px', xl: '1200px' } }}
			>
				{/* main card */}
				<Grid size={12}>
					<ChildCard>
						<Grid container spacing={3}>
							<Grid size={{ xs: 12, lg: 6 }}>
								<ProductCarousel />
							</Grid>
							<Grid size={{ xs: 12, lg: 6 }}>
								<ProductDetail />
							</Grid>
						</Grid>
					</ChildCard>
				</Grid>

				{/* description */}
				<Grid size={12}>
					<ProductDesc />
				</Grid>

				{/* related products */}
				<Grid size={12}>
					<ProductRelated />
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default EcommerceDetail
