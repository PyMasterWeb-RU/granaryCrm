import type { Deal } from '@/types/deal'
import { cookies } from 'next/headers'
import DealTabs from './DealTabs'

interface Props {
	params: { id: string }
}

export default async function DealPage({ params: { id } }: Props) {
	const token = cookies().get('access_token')?.value
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deals/${id}`, {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
		cache: 'no-store',
	})
	if (!res.ok) return <div>Сделка не найдена</div>
	const deal: Deal = await res.json()

	return <DealTabs initialDeal={deal} />
}
