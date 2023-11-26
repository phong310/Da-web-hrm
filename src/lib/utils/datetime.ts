const isWeekend = (date: Date | string) => {
    const d = new Date(date)

    return d.getDay() === 0 || d.getDay() === 6
}


export {
    isWeekend,
}