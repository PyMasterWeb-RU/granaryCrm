export interface Company {
  id: string
  name: string
  industry?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  address?: string | null
  inn?: string | null
  kpp?: string | null
  ogrn?: string | null
  ownerId: string
  createdAt: string // или Date, в зависимости от того, как ты парсишь
  owner?: {
    id: string
    email: string
  }
}
