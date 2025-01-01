import type { Component } from "vue"

export interface Btn {
  type?: 'primary' | 'secondary'
  size?: 'default' | 'large'
  icon?: Component
}
