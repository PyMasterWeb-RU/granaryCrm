import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import TableColumnDragDrop from '@/app/components/react-table/TableColumnDragDrop'
import TableRowDragDrop from '@/app/components/react-table/TableRowDragDrop'
import Grid from '@mui/material/Grid'

const BCrumb = [
	{ to: '/', title: 'Home' },
	{ title: 'Drag & Drop React Table' },
]

function page() {
	return (
		<PageContainer
			title='Drag & drop Table'
			description='this is Drag & Drop Table'
		>
			<Breadcrumb title='Drag & Drop Table' items={BCrumb} />

			<Grid container spacing={3}>
				<Grid size={12}>
					<TableRowDragDrop />
				</Grid>
				<Grid size={12}>
					<TableColumnDragDrop />
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default page
