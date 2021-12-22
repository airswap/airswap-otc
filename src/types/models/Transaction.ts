export interface TransactionStatus {
  submitting: boolean
  errorSubmitting: string
  mining: boolean
  transaction: string
  mined: boolean
  transactionReceipt: string
  errorMining: string
}
