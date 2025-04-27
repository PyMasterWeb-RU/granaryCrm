'use client'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import BlankCard from '@/app/components/shared/BlankCard'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import * as React from 'react'

import AccountTab from '@/app/components/pages/account-setting/AccountTab'
import BillsTab from '@/app/components/pages/account-setting/BillsTab'
import NotificationTab from '@/app/components/pages/account-setting/NotificationTab'
import SecurityTab from '@/app/components/pages/account-setting/SecurityTab'
import {
	IconArticle,
	IconBell,
	IconLock,
	IconUserCircle,
} from '@tabler/icons-react'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Account Setting' }]

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box>{children}</Box>}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

const AccountSetting = () => {
	const [value, setValue] = React.useState(0)
	const handleChange = (_: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
	}

	return (
		<PageContainer
			title='Account Setting'
			description='this is Account Setting'
		>
			<Breadcrumb title='Account Setting' items={BCrumb} />

			<Grid container spacing={3}>
				<Grid size={12}>
					<BlankCard>
						<Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
							<Tabs
								value={value}
								onChange={handleChange}
								scrollButtons='auto'
								aria-label='account setting tabs'
							>
								<Tab
									icon={<IconUserCircle size={22} />}
									iconPosition='start'
									label='Account'
									{...a11yProps(0)}
								/>
								<Tab
									icon={<IconBell size={22} />}
									iconPosition='start'
									label='Notifications'
									{...a11yProps(1)}
								/>
								<Tab
									icon={<IconArticle size={22} />}
									iconPosition='start'
									label='Bills'
									{...a11yProps(2)}
								/>
								<Tab
									icon={<IconLock size={22} />}
									iconPosition='start'
									label='Security'
									{...a11yProps(3)}
								/>
							</Tabs>
						</Box>
						<Divider />
						<CardContent>
							<TabPanel value={value} index={0}>
								<AccountTab />
							</TabPanel>
							<TabPanel value={value} index={1}>
								<NotificationTab />
							</TabPanel>
							<TabPanel value={value} index={2}>
								<BillsTab />
							</TabPanel>
							<TabPanel value={value} index={3}>
								<SecurityTab />
							</TabPanel>
						</CardContent>
					</BlankCard>
				</Grid>
			</Grid>
		</PageContainer>
	)
}

export default AccountSetting
