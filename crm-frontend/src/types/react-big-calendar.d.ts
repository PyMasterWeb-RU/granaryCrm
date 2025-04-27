import { Component } from 'react'
import 'react-big-calendar'

declare module 'react-big-calendar' {
	export interface Calendar<TEvent = any, TResource = any>
		extends Component<CalendarProps<TEvent, TResource>> {
		refs: any
	}
}
