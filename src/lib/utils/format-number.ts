export const numberWithCommas = (num: number | string) => {
    const arr = num.toString().split('.')
    if (arr.length === 1) {
        return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + arr[1]
}
