import IconsDashboard from "@/components/icons/IconsDashboard.vue"
import IconsTransaction from "@/components/icons/IconsTransaction.vue"

export const ROUTES = [
  {
    uri: '/',
    icon: IconsDashboard,
    title: 'Dashboard'
  },
  {
    uri: '/transactions',
    icon: IconsTransaction,
    title: 'Transactions'
  }
]
