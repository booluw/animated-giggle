export const formatMoney = (money: string) => Number(money).toLocaleString('en-US', {style: 'currency', currency: 'USD'})

export const formatNumber = (num?: number|string) => {
  const format = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  })

  return format.format(Number(num))
}

export const getRandomColor = function() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
