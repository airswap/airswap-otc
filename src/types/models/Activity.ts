export interface TransactionActivity {
  description: string
  txStatus: 'Confirmed' | 'Cancelled' | 'Failed' | 'Pending'
  txHash: string
  timestamp: number
}
