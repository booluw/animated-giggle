import type { Component } from "vue"

export interface Btn {
  type?: 'primary' | 'secondary'
  size?: 'default' | 'large'
  icon?: Component
}

export interface Notification {
  title: string
  type: 'success' | 'error' | 'warning'
  message?: string
  action?: unknown
  actionText?: string
}
