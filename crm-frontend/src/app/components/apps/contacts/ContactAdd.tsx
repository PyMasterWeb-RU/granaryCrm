import { addContact } from '@/store/apps/contacts/ContactSlice'
import { useDispatch, useSelector } from '@/store/hooks'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import React from 'react'
import user1 from '/public/images/profile/user-10.jpg'

const ContactAdd = () => {
	const dispatch = useDispatch()
	const id = useSelector(state => state.contactsReducer.contacts.length + 1)
	const [modal, setModal] = React.useState(false)

	const toggle = () => {
		setModal(!modal)
	}

	const [values, setValues] = React.useState({
		firstname: '',
		lastname: '',
		department: '',
		company: '',
		phone: '',
		email: '',
		address: '',
		notes: '',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		dispatch(
			addContact(
				id,
				values.firstname,
				values.lastname,
				user1.src, // Передаём user1.src, чтобы было string
				values.department,
				values.company,
				values.phone,
				values.email,
				values.address,
				values.notes
			)
		)
		setModal(false)
	}

	return (
		<>
			<Box p={3} pb={1}>
				<Button color='primary' variant='contained' fullWidth onClick={toggle}>
					Add New Contact
				</Button>
			</Box>

			<Dialog
				open={modal}
				onClose={toggle}
				maxWidth='sm'
				aria-labelledby='add-contact-title'
				aria-describedby='add-contact-description'
			>
				<DialogTitle id='add-contact-title' variant='h5'>
					Add New Contact
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='add-contact-description'>
						Fill in all fields and click Submit to add a new contact.
					</DialogContentText>
					<Box mt={3}>
						<form onSubmit={handleSubmit}>
							<Grid container spacing={3} sx={{ mb: 4 }}>
								<Grid size={{ xs: 12, lg: 6 }}>
									<FormLabel>First Name</FormLabel>
									<TextField
										id='firstname'
										size='small'
										variant='outlined'
										fullWidth
										value={values.firstname}
										onChange={e =>
											setValues({ ...values, firstname: e.target.value })
										}
									/>
								</Grid>

								<Grid size={{ xs: 12, lg: 6 }}>
									<FormLabel>Last Name</FormLabel>
									<TextField
										id='lastname'
										size='small'
										variant='outlined'
										fullWidth
										value={values.lastname}
										onChange={e =>
											setValues({ ...values, lastname: e.target.value })
										}
									/>
								</Grid>

								<Grid size={{ xs: 12, lg: 6 }}>
									<FormLabel>Department</FormLabel>
									<TextField
										id='department'
										size='small'
										variant='outlined'
										fullWidth
										value={values.department}
										onChange={e =>
											setValues({ ...values, department: e.target.value })
										}
									/>
								</Grid>

								<Grid size={{ xs: 12, lg: 6 }}>
									<FormLabel>Company</FormLabel>
									<TextField
										id='company'
										size='small'
										variant='outlined'
										fullWidth
										value={values.company}
										onChange={e =>
											setValues({ ...values, company: e.target.value })
										}
									/>
								</Grid>

								<Grid size={{ xs: 12, lg: 6 }}>
									<FormLabel>Phone</FormLabel>
									<TextField
										id='phone'
										size='small'
										variant='outlined'
										fullWidth
										value={values.phone}
										onChange={e =>
											setValues({ ...values, phone: e.target.value })
										}
									/>
								</Grid>

								<Grid size={{ xs: 12, lg: 6 }}>
									<FormLabel>Email</FormLabel>
									<TextField
										id='email'
										type='email'
										required
										size='small'
										variant='outlined'
										fullWidth
										value={values.email}
										onChange={e =>
											setValues({ ...values, email: e.target.value })
										}
									/>
								</Grid>

								<Grid size={{ xs: 12, lg: 12 }}>
									<FormLabel>Address</FormLabel>
									<TextField
										id='address'
										size='small'
										multiline
										rows={3}
										variant='outlined'
										fullWidth
										value={values.address}
										onChange={e =>
											setValues({ ...values, address: e.target.value })
										}
									/>
								</Grid>

								<Grid size={{ xs: 12, lg: 12 }}>
									<FormLabel>Notes</FormLabel>
									<TextField
										id='notes'
										size='small'
										multiline
										rows={4}
										variant='outlined'
										fullWidth
										value={values.notes}
										onChange={e =>
											setValues({ ...values, notes: e.target.value })
										}
									/>
								</Grid>

								<Grid
									size={{ xs: 12, lg: 12 }}
									sx={{ display: 'flex', gap: 1 }}
								>
									<Button
										variant='contained'
										color='primary'
										type='submit'
										disabled={
											values.firstname.length === 0 || values.notes.length === 0
										}
									>
										Submit
									</Button>
									<Button variant='contained' color='error' onClick={toggle}>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</form>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default ContactAdd
