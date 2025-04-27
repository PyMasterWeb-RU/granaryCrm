'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import RadioGroup from '@mui/material/RadioGroup'
import { SliderThumb, SliderValueLabelProps } from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'
import CustomDisabledButton from '@/app/components/forms/theme-elements/CustomDisabledButton'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel'
import CustomOutlinedButton from '@/app/components/forms/theme-elements/CustomOutlinedButton'
import CustomRadio from '@/app/components/forms/theme-elements/CustomRadio'
import CustomRangeSlider from '@/app/components/forms/theme-elements/CustomRangeSlider'
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect'
import CustomSlider from '@/app/components/forms/theme-elements/CustomSlider'
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch'
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'

import { Theme } from '@mui/material'
import { IconVolume, IconVolume2 } from '@tabler/icons-react'

function CustomThumbComponent(props: SliderValueLabelProps) {
	const { children, ...other } = props

	return (
		<SliderThumb {...other}>
			{children}
			<Box sx={{ height: 9, width: '2px', backgroundColor: '#fff' }} />
			<Box sx={{ height: 14, width: '2px', backgroundColor: '#fff', ml: 2 }} />
			<Box sx={{ height: 9, width: '2px', backgroundColor: '#fff', ml: 2 }} />
		</SliderThumb>
	)
}

export default function FormCustom() {
	const [age, setAge] = React.useState('1')
	const [select1, setSelect] = React.useState('1')
	const [select2, setSelect2] = React.useState('1')

	const handleChange = (e: any) => setAge(e.target.value)
	const handleChange4 = (e: any) => setSelect(e.target.value)
	const handleChange5 = (e: any) => setSelect2(e.target.value)

	const [value, setValue] = React.useState<Date | null>(null)
	const [value2, setValue2] = React.useState<Date | null>(null)
	const [value3, setValue3] = React.useState(30)
	const handleChange6 = (_: any, v: number | number[]) => setValue3(v as number)

	return (
		<PageContainer title='Custom Form' description='this is Custom Form'>
			<Breadcrumb title='Custom Form' subtitle='custom designed element' />
			<ParentCard title='Custom Form'>
				<Grid container spacing={3}>
					{/* Column 1 */}
					<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
						<CustomFormLabel htmlFor='name'>Name</CustomFormLabel>
						<CustomTextField id='name' placeholder='Enter text' fullWidth />

						<CustomFormLabel htmlFor='demo-simple-select'>
							Select Dropdown
						</CustomFormLabel>
						<CustomSelect
							id='demo-simple-select'
							value={age}
							onChange={handleChange}
							fullWidth
						>
							<MenuItem value={1}>One</MenuItem>
							<MenuItem value={2}>Two</MenuItem>
							<MenuItem value={3}>Three</MenuItem>
						</CustomSelect>
					</Grid>

					{/* Column 2 */}
					<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
						<CustomFormLabel htmlFor='cname'>Company Name</CustomFormLabel>
						<CustomTextField id='cname' placeholder='Enter text' fullWidth />

						<CustomFormLabel htmlFor='time'>Time</CustomFormLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								value={value2}
								onChange={setValue2}
								renderInput={params => (
									<CustomTextField
										{...params}
										fullWidth
										sx={{
											'& .MuiSvgIcon-root': { width: 18, height: 18 },
											'& .MuiFormHelperText-root': { display: 'none' },
										}}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>

					{/* Column 3 */}
					<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
						<CustomFormLabel htmlFor='disabled'>Industry Type</CustomFormLabel>
						<CustomTextField
							id='disabled'
							placeholder='Disabled filled'
							fullWidth
							disabled
							sx={{
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: (theme: Theme) =>
										theme.palette.mode === 'dark'
											? 'rgba(255,255,255,0.12)!important'
											: '#dee3e9!important',
								},
							}}
						/>

						<CustomFormLabel htmlFor='date'>Date</CustomFormLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								value={value}
								onChange={setValue}
								renderInput={params => (
									<CustomTextField
										{...params}
										fullWidth
										sx={{
											'& .MuiSvgIcon-root': { width: 18, height: 18 },
											'& .MuiFormHelperText-root': { display: 'none' },
										}}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>

					{/* Column 4 */}
					<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
						<CustomFormLabel>Lorem ipsum dolor sit amet</CustomFormLabel>
						<RadioGroup name='radio-buttons-group' defaultValue='radio1'>
							<Grid container>
								<Grid size={{ xs: 12, sm: 4, lg: 4 }}>
									<FormControl component='fieldset'>
										<FormControlLabel
											control={<CustomRadio />}
											label='Male'
											value='radio1'
										/>
									</FormControl>
								</Grid>
								<Grid size={{ xs: 12, sm: 4, lg: 4 }}>
									<FormControl component='fieldset'>
										<FormControlLabel
											control={<CustomRadio />}
											label='Female'
											value='radio2'
										/>
									</FormControl>
								</Grid>
								<Grid size={{ xs: 12, sm: 4, lg: 4 }}>
									<FormControl component='fieldset'>
										<FormControlLabel
											control={<CustomRadio disabled />}
											label='Disabled'
											value='radio3'
										/>
									</FormControl>
								</Grid>
							</Grid>
						</RadioGroup>
					</Grid>

					{/* Column 5 */}
					<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
						<CustomFormLabel>Industry Type</CustomFormLabel>
						<RadioGroup name='checkbox-group' defaultValue='checkbox1'>
							<Grid container>
								<Grid size={{ xs: 12, sm: 4, lg: 4 }}>
									<FormControlLabel
										control={<CustomCheckbox defaultChecked />}
										label='Enter text'
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 4, lg: 4 }}>
									<FormControlLabel
										control={<CustomCheckbox />}
										label='Enter text'
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 4, lg: 4 }}>
									<FormControlLabel
										control={<CustomCheckbox disabled />}
										label='Disabled'
									/>
								</Grid>
							</Grid>
						</RadioGroup>
					</Grid>

					{/* Column 6 */}
					<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
						<CustomFormLabel>Slider</CustomFormLabel>
						<CustomRangeSlider
							slots={{ thumb: CustomThumbComponent }}
							getAriaLabel={i => (i === 0 ? 'Minimum price' : 'Maximum price')}
							defaultValue={[20, 40]}
						/>
						<Grid container spacing={2} mt={1}>
							<Grid size={{ xs: 12, sm: 6, lg: 6 }}>
								<CustomSelect
									id='range1'
									value={select1}
									onChange={handleChange4}
									fullWidth
								>
									<MenuItem value={1}>750</MenuItem>
									<MenuItem value={2}>850</MenuItem>
									<MenuItem value={3}>950</MenuItem>
								</CustomSelect>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 6 }}>
								<CustomSelect
									id='rang2'
									value={select2}
									onChange={handleChange5}
									fullWidth
								>
									<MenuItem value={1}>950</MenuItem>
									<MenuItem value={2}>1050</MenuItem>
									<MenuItem value={3}>1150</MenuItem>
								</CustomSelect>
							</Grid>
						</Grid>

						<CustomFormLabel sx={{ mt: 3 }}>Volume</CustomFormLabel>
						<CustomSlider
							value={value3}
							onChange={handleChange6}
							aria-label='Volume'
						/>

						<Box display='flex' alignItems='stretch'>
							<Typography>
								<IconVolume2 width={20} />
							</Typography>
							<Box ml='auto'>
								<Typography>
									<IconVolume width={20} />
								</Typography>
							</Box>
						</Box>
					</Grid>

					{/* Column 7 */}
					<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
						<CustomFormLabel>Switch</CustomFormLabel>
						<Grid container spacing={0}>
							<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
								<FormControlLabel
									control={<CustomSwitch />}
									label='Enter text'
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
								<FormControlLabel
									control={<CustomSwitch defaultChecked />}
									label='Enter text'
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
								<FormControlLabel
									control={
										<CustomSwitch
											disabled
											sx={{
												'& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track':
													{
														opacity: 1,
													},
											}}
										/>
									}
									label='Disabled'
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
								<FormControlLabel
									control={
										<CustomSwitch
											defaultChecked
											disabled
											sx={{
												'& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
													opacity: 0.5,
												},
											}}
										/>
									}
									label='Disabled'
								/>
							</Grid>
						</Grid>

						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							justifyContent='space-between'
							mt={2}
						>
							<Stack direction='row' spacing={1}>
								<Button variant='contained' color='primary'>
									Add New
								</Button>
								<CustomDisabledButton variant='contained'>
									Add New
								</CustomDisabledButton>
								<CustomOutlinedButton variant='outlined'>
									Add New
								</CustomOutlinedButton>
							</Stack>
							<Stack direction='row' spacing={1}>
								<Button variant='contained' color='secondary'>
									Add New
								</Button>
								<Button variant='contained' color='success'>
									Add New
								</Button>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
			</ParentCard>
		</PageContainer>
	)
}
