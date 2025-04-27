import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
	const token = req.cookies.get('access_token')?.value

	const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

	// Если пользователь уже залогинен и пытается попасть на страницу логина — редиректим на дашборд
	if (token && isAuthPage) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	// Если пользователь не авторизован и хочет попасть на защищённую страницу
	if (!token && !isAuthPage) {
		return NextResponse.redirect(new URL('/auth/login', req.url)) // <-- ТЕПЕРЬ ЭТО ПРАВИЛЬНО
	}

	// Иначе пропускаем запрос дальше
	return NextResponse.next()
}

// Ограничиваем middleware только нужными роутами
export const config = {
	matcher: [
		'/',
		'/dashboard/:path*',
		'/profile/:path*',
		'/settings/:path*',
		'/projects/:path*',
		'/tasks/:path*',
		'/auth/:path*', // чтобы перенаправить если пользователь уже авторизован
	],
}
