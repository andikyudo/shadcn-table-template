import { TransactionForm } from '@/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewTransactionPage() {
  const handleSubmit = async (values: any) => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      throw new Error('Failed to create transaction')
    }

    return response.json()
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Transaksi Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
