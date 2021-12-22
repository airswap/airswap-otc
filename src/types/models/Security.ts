export interface PreTransferCheckPayload {
  contractAddress: string
  from: string
  to: string
  value: string
}

export interface PreTransferCheckResponse {
  response: {
    code: string
    reason: string
  }
  namespace: string
  name: string
  parameters: Record<string, any>
  timestamp: number
}
