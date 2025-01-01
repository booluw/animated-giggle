export interface Summary {
  total_transaction: string,
  transaction_value: string,
  transaction_cost: string,
  avg_completed_date: string,
  total_disbursement: string,
  gross_profitability: string,
  avg_execution_time: string,
  awarding_company_summary: { awarding_company: string, value_usd: string, count: string } [],
  transaction_type_summary: { transaction_type: string, value_usd: string, count: string } [],
  soc_summary: { name: string, value_usd: string }[]
}
