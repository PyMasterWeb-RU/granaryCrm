import { Providers } from '@/store/providers'
import React from 'react'
import MyApp from './app'
import './global.css'

import { AuthProvider } from '@/app/providers/AuthContext' // добавляем AuthProvider

export const metadata = {
	title: 'Modernize Main Demo',
	description: 'Modernize Main kit',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body>
				<Providers>
					<AuthProvider>
						<MyApp>{children}</MyApp>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	)
}
