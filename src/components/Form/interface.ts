/* eslint-disable @typescript-eslint/no-explicit-any */
type FormRules = (value: string) => boolean | string
export type Rules = { message?: string, valid: FormRules }

export interface Form {
  model: any
  required?: boolean
  rules?: Record<string, Rules>
}

export interface FormItem {
  prop?: string
}
