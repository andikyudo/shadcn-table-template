export interface Transaction {
  id: string
  date: string
  account: string
  payee: string
  category: string
  memo: string
  outflow: number | null
  inflow: number | null
  cleared: boolean
}
