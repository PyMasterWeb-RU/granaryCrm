import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import chinese from '../utils/languages/ch.json'
import english from '../utils/languages/en.json'
import russian from '../utils/languages/ru.json'

const resources = {
	en: {
		translation: english,
	},
	ch: {
		translation: chinese,
	},
	ru: {
		translation: russian,
	},
}

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: 'en',
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	})

export default i18n
