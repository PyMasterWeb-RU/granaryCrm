import {
	DeleteContact,
	SelectContact,
	fetchContacts,
	toggleStarredContact,
} from '@/store/apps/contacts/ContactSlice'
import { useDispatch, useSelector } from '@/store/hooks'
import List from '@mui/material/List'
import { useEffect, useMemo } from 'react'

import type { ContactType } from '../../../(DashboardLayout)/types/apps/contact'
import Scrollbar from '../../../components/custom-scroll/Scrollbar'
import ContactListItem from './ContactListItem'

// Ваша функция фильтрации без изменений
const getVisibleContacts = (
	contacts: ContactType[],
	filter: string,
	contactSearch: string
) => {
	const search = contactSearch.toLowerCase()
	switch (filter) {
		case 'show_all':
			return contacts.filter(
				c => !c.deleted && c.firstname.toLowerCase().includes(search)
			)
		case 'frequent_contact':
			return contacts.filter(
				c =>
					!c.deleted &&
					c.frequentlycontacted &&
					c.firstname.toLowerCase().includes(search)
			)
		case 'starred_contact':
			return contacts.filter(
				c =>
					!c.deleted && c.starred && c.firstname.toLowerCase().includes(search)
			)
		case 'engineering_department':
			return contacts.filter(
				c =>
					!c.deleted &&
					c.department === 'Engineering' &&
					c.firstname.toLowerCase().includes(search)
			)
		case 'support_department':
			return contacts.filter(
				c =>
					!c.deleted &&
					c.department === 'Support' &&
					c.firstname.toLowerCase().includes(search)
			)
		case 'sales_department':
			return contacts.filter(
				c =>
					!c.deleted &&
					c.department === 'Sales' &&
					c.firstname.toLowerCase().includes(search)
			)
		default:
			return []
	}
}

const ContactList = ({
	showrightSidebar,
}: {
	showrightSidebar: () => void
}) => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchContacts())
	}, [dispatch])

	// 1) Забираем «сырые» контакты из стора
	//    и явно приводим их к ContactType[], чтобы TS не ругался
	const rawContacts = useSelector(
		state => state.contactsReducer.contacts
	) as unknown as ContactType[]

	const currentFilter = useSelector(
		state => state.contactsReducer.currentFilter
	)
	const contactSearch = useSelector(
		state => state.contactsReducer.contactSearch
	)
	const activeId = useSelector(
		state => state.contactsReducer.contactContent
	) as unknown as number // если у вас contactContent хранится string, то тоже можно привести

	// 2) Мемоизируем функцию фильтрации, чтобы избежать лишних перерисовок
	const contacts = useMemo(
		() => getVisibleContacts(rawContacts, currentFilter, contactSearch),
		[rawContacts, currentFilter, contactSearch]
	)

	return (
		<Scrollbar
			sx={{
				height: { lg: 'calc(100vh - 100px)', md: '100vh' },
				maxHeight: '800px',
			}}
		>
			<List>
				{contacts.map(contact => (
					<ContactListItem
						key={contact.id}
						// явно приводим contact.id к number, если нужно
						active={Number(contact.id) === activeId}
						{...contact}
						onContactClick={() => {
							dispatch(SelectContact(Number(contact.id)))
							showrightSidebar()
						}}
						onDeleteClick={() => dispatch(DeleteContact(Number(contact.id)))}
						onStarredClick={() =>
							dispatch(toggleStarredContact(Number(contact.id)))
						}
					/>
				))}
			</List>
		</Scrollbar>
	)
}

export default ContactList
