// src/app/(DashboardLayout)/apps/companies/[id]/page.tsx
import CompanyTabs from './CompanyTabs'
import type { Company } from '@/types/company'
import { cookies } from 'next/headers'

interface Props {
  params: { id: string }
}

export default async function CompanyPage({ params: { id } }: Props) {
  const token = cookies().get('access_token')?.value
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${id}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      cache: 'no-store',
    }
  )
  if (!res.ok) return <div>Компания не найдена</div>
  const company: Company = await res.json()

  return <CompanyTabs initialCompany={company} />
}
