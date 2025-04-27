import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import { Button, Grid, Stack } from '@mui/material'

import CustomersReviews from '@/app/components/apps/ecommerce/productEdit/CustomersReviews'
import GeneralCard from '@/app/components/apps/ecommerce/productEdit/GeneralCard'
import MediaCard from '@/app/components/apps/ecommerce/productEdit/Media'
import PricingCard from '@/app/components/apps/ecommerce/productEdit/Pricing'
import ProductAvgSales from '@/app/components/apps/ecommerce/productEdit/ProductAvgSales'
import ProductDetails from '@/app/components/apps/ecommerce/productEdit/ProductDetails'
import ProductTemplate from '@/app/components/apps/ecommerce/productEdit/ProductTemplate'
import StatusCard from '@/app/components/apps/ecommerce/productEdit/Status'
import Thumbnail from '@/app/components/apps/ecommerce/productEdit/Thumbnail'
import VariationCard from '@/app/components/apps/ecommerce/productEdit/VariationCard'
import BlankCard from '@/app/components/shared/BlankCard'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Edit Product' }]

const EcommerceEditProduct = () => {
	return (
		<PageContainer title='Edit Product' description='this is Edit Product'>
			{/* breadcrumb */}
			<Breadcrumb title='Edit Product' items={BCrumb} />

			<form>
				<Grid container spacing={3}>
					{/* main form area */}
					<Grid size={{ xs: 12, lg: 8 }}>
						<Stack spacing={3}>
							<BlankCard>
								<GeneralCard />
							</BlankCard>

							<BlankCard>
								<MediaCard />
							</BlankCard>

							<BlankCard>
								<VariationCard />
							</BlankCard>

							<BlankCard>
								<PricingCard />
							</BlankCard>

							<BlankCard>
								<CustomersReviews />
							</BlankCard>
						</Stack>
					</Grid>

					{/* sidebar */}
					<Grid size={{ xs: 12, lg: 4 }}>
						<Stack spacing={3}>
							<BlankCard>
								<Thumbnail />
							</BlankCard>

							<BlankCard>
								<StatusCard />
							</BlankCard>

							<BlankCard>
								<ProductDetails />
							</BlankCard>

							<BlankCard>
								<ProductAvgSales />
							</BlankCard>

							<BlankCard>
								<ProductTemplate />
							</BlankCard>
						</Stack>
					</Grid>
				</Grid>

				<Stack direction='row' spacing={2} mt={3}>
					<Button variant='contained' color='primary'>
						Save Changes
					</Button>
					<Button variant='outlined' color='error'>
						Cancel
					</Button>
				</Stack>
			</form>
		</PageContainer>
	)
}

export default EcommerceEditProduct
