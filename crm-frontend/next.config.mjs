// next.config.mjs
const nextConfig = {
	reactStrictMode: false,

	// Проксируем все запросы /api/* на ваш NestJS-бэкенд на порт 4200
	async rewrites() {
		return [
			{
				source: '/backend/:path*',
				destination: 'http://localhost:4200/api/:path*',
			},
		]
	},
}

export default nextConfig
