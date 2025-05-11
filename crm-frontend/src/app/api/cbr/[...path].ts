// pages/api/cbr/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// segments = ['daily_json.js'] или ['archive','2025','05','05','daily_json.js']
	const { path } = req.query
	const segments = Array.isArray(path) ? path : [path]
	const targetUrl = `https://www.cbr-xml-daily.ru/${segments.join('/')}`

	try {
		const response = await fetch(targetUrl)
		if (!response.ok) {
			// просто проксируем статус (404, 500 и т.д.)
			return res.status(response.status).end()
		}
		// всегда возвращаем JSON
		const data = await response.json()
		res.setHeader('Content-Type', 'application/json')
		// (необязательно) если кто-то ещё будет обращаться к этому роуту с другого фронтенда
		res.setHeader('Access-Control-Allow-Origin', '*')
		return res.status(200).json(data)
	} catch (err) {
		console.error('CBR proxy error:', err)
		return res.status(500).json({ error: 'Сбой при запросе к ЦБ РФ' })
	}
}
