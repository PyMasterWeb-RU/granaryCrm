// src/store/apps/contacts/types.ts

// Описание одного контакта
export interface Contact {
  id: number;
  firstname: string;
  lastname: string;
  department?: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  image?: string;
  frequentlycontacted: boolean;
  starred: boolean;
  deleted: boolean;
}

// Описание части state для контактов
export interface ContactsState {
  contacts: Contact[];
  contactContent: number;
  contactSearch: string;
  editContact: boolean;
  currentFilter: 'show_all' | 'starred' | 'deleted' | string;
}
