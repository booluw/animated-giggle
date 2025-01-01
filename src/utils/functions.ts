export const formatMoney = (money: string) => Number(money).toLocaleString('en-US', {style: 'currency', currency: 'USD'})

export const formatNumber = (num?: number|string) => {
  const format = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  })

  return format.format(Number(num))
}
