// src/store/apps/contacts/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

// 1) Базовый селектор — просто отдаёт весь массив контактов
export const selectAllContacts = (state: RootState) =>
  state.contactsReducer.contacts;

// 2) Если в вашем списке есть поиск:
export const selectContactSearch = (state: RootState) =>
  state.contactsReducer.contactSearch;

// 3) Пример: селектор, который фильтрует контакты по поисковой строке
export const selectFilteredContacts = createSelector(
  [selectAllContacts, selectContactSearch],
  (contacts, search) => {
    if (!search) return contacts;
    const lower = search.toLowerCase();
    return contacts.filter(
      c =>
        c.firstname.toLowerCase().includes(lower) ||
        c.lastname.toLowerCase().includes(lower) ||
        c.company?.toLowerCase().includes(lower)
    );
  }
);

// 4) Ещё примеры: выделенные, удалённые, избранные
export const selectStarredContacts = createSelector(
  [selectAllContacts],
  contacts => contacts.filter(c => c.starred)
);

export const selectDeletedContacts = createSelector(
  [selectAllContacts],
  contacts => contacts.filter(c => c.deleted)
);
