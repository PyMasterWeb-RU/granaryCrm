import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ChildCard from '@/app/components/shared/ChildCard'
import ParentCard from '@/app/components/shared/ParentCard'
import AlertTransition from '@/app/components/ui-components/alert/AlertTransition'

import ActionCode from '@/app/components/ui-components/alert/code/ActionCode'
import DescriptionCode from '@/app/components/ui-components/alert/code/DescriptionCode'
import FilledCode from '@/app/components/ui-components/alert/code/FilledCode'
import OutlinedCode from '@/app/components/ui-components/alert/code/OutlinedCode'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Alert' }]

const ExAlert = () => {
	return (
		<PageContainer title='Alert' description='this is Alert'>
			<Breadcrumb title='Alert' items={BCrumb} />

			<ParentCard title='Alert'>
				<Grid container spacing={3}>
					{/* Filled Alert */}
					<Grid size={12} display='flex' alignItems='stretch'>
						<ChildCard title='Filled' codeModel={<FilledCode />}>
							<Stack spacing={1}>
								<Alert variant='filled' severity='error'>
									This is an error alert — check it out!
								</Alert>
								<Alert variant='filled' severity='warning'>
									This is a warning alert — check it out!
								</Alert>
								<Alert variant='filled' severity='info'>
									This is an info alert — check it out!
								</Alert>
								<Alert variant='filled' severity='success'>
									This is a success alert — check it out!
								</Alert>
							</Stack>
						</ChildCard>
					</Grid>

					{/* Outlined Alert */}
					<Grid size={12} display='flex' alignItems='stretch'>
						<ChildCard title='Outlined' codeModel={<OutlinedCode />}>
							<Stack spacing={1}>
								<Alert variant='outlined' severity='error'>
									This is an error alert — check it out!
								</Alert>
								<Alert variant='outlined' severity='warning'>
									This is a warning alert — check it out!
								</Alert>
								<Alert variant='outlined' severity='info'>
									This is an info alert — check it out!
								</Alert>
								<Alert variant='outlined' severity='success'>
									This is a success alert — check it out!
								</Alert>
							</Stack>
						</ChildCard>
					</Grid>

					{/* Description Alert */}
					<Grid size={12} display='flex' alignItems='stretch'>
						<ChildCard title='Description' codeModel={<DescriptionCode />}>
							<Stack spacing={1}>
								<Alert variant='filled' severity='error'>
									<AlertTitle>Error</AlertTitle>
									This is an error alert — <strong>check it out!</strong>
								</Alert>
								<Alert variant='filled' severity='warning'>
									<AlertTitle>Warning</AlertTitle>
									This is a warning alert — <strong>check it out!</strong>
								</Alert>
								<Alert variant='filled' severity='info'>
									<AlertTitle>Info</AlertTitle>
									This is an info alert — <strong>check it out!</strong>
								</Alert>
								<Alert variant='filled' severity='success'>
									<AlertTitle>Success</AlertTitle>
									This is a success alert — <strong>check it out!</strong>
								</Alert>
							</Stack>
						</ChildCard>
					</Grid>

					{/* Action Alert */}
					<Grid size={12} display='flex' alignItems='stretch'>
						<ChildCard title='Action' codeModel={<ActionCode />}>
							<Stack spacing={1}>
								<Alert variant='filled' severity='warning'>
									This is a warning alert — check it out!
								</Alert>
								<Alert
									variant='filled'
									severity='info'
									action={
										<Button color='inherit' size='small'>
											UNDO
										</Button>
									}
								>
									This is an info alert — check it out!
								</Alert>
							</Stack>
						</ChildCard>
					</Grid>

					{/* Transition Alert */}
					<Grid size={12} display='flex' alignItems='stretch'>
						<AlertTransition />
					</Grid>
				</Grid>
			</ParentCard>
		</PageContainer>
	)
}

export default ExAlert
