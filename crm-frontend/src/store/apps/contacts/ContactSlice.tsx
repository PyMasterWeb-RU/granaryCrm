// src/store/apps/contacts/ContactSlice.ts
import axios from '../../../utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../../store';
import type { ContactsState, Contact } from './types';

const API_URL = '/api/data/contacts/ContactsData';

const initialState: ContactsState = {
  contacts: [],
  contactContent: 1,
  contactSearch: '',
  editContact: false,
  currentFilter: 'show_all',
};

export const ContactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Загрузить весь список
    getContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },

    // Поиск по строке
    SearchContact: (state, action: PayloadAction<string>) => {
      state.contactSearch = action.payload;
    },

    // Выбор текущего контакта (по индексу или id)
    SelectContact: (state, action: PayloadAction<number>) => {
      state.contactContent = action.payload;
    },

    // Удалить / восстановить контакт
    DeleteContact: (state, action: PayloadAction<number>) => {
      state.contacts = state.contacts.map(contact =>
        contact.id === action.payload
          ? { ...contact, deleted: !contact.deleted }
          : contact
      );
    },

    // Пометить / снять пометку "избранный"
    toggleStarredContact: (state, action: PayloadAction<number>) => {
      state.contacts = state.contacts.map(contact =>
        contact.id === action.payload
          ? { ...contact, starred: !contact.starred }
          : contact
      );
    },

    // Включить / выключить режим редактирования
    isEdit: state => {
      state.editContact = !state.editContact;
    },

    // Установить фильтр видимости
    setVisibilityFilter: (
      state,
      action: PayloadAction<ContactsState['currentFilter']>
    ) => {
      state.currentFilter = action.payload;
    },

    // Обновить одно поле контакта
    UpdateContact: {
      reducer: (
        state,
        action: PayloadAction<{
          id: number;
          field: keyof Contact;
          value: Contact[keyof Contact];
        }>
      ) => {
        const { id, field, value } = action.payload;
        state.contacts = state.contacts.map(contact =>
          contact.id === id ? { ...contact, [field]: value } : contact
        );
      },
      prepare: (
        id: number,
        field: keyof Contact,
        value: Contact[keyof Contact]
      ) => ({
        payload: { id, field, value },
      }),
    },

    // Добавить новый контакт
    addContact: {
      reducer: (state, action: PayloadAction<Contact>) => {
        state.contacts.push(action.payload);
      },
      prepare: (
        id: number,
        firstname: string,
        lastname: string,
        image: string,
        department: string,
        company: string,
        phone: string,
        email: string,
        address: string,
        notes: string
      ) => ({
        payload: {
          id,
          firstname,
          lastname,
          image,
          department,
          company,
          phone,
          email,
          address,
          notes,
          frequentlycontacted: false,
          starred: false,
          deleted: false,
        } as Contact,
      }),
    },
  },
});

export const {
  getContacts,
  SearchContact,
  isEdit,
  SelectContact,
  DeleteContact,
  toggleStarredContact,
  UpdateContact,
  addContact,
  setVisibilityFilter,
} = ContactSlice.actions;

// Thunk для загрузки контактов
export const fetchContacts = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get<Contact[]>(API_URL);
    dispatch(getContacts(response.data));
  } catch (err: any) {
    console.error('Failed to fetch contacts', err);
  }
};

export default ContactSlice.reducer;
