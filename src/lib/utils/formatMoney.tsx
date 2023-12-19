export const formatMoney = (value: any) => {
  const roundedValue = value ? parseFloat(value).toFixed() : '0'
  const formattedValue = roundedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return formattedValue
}
