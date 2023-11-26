import { request } from 'lib/request'

const exportApi = (url: string, fileName?: string) =>
    request
        .get(url, {
            responseType: 'blob'
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName || 'tables.xlsx')
            document.body.appendChild(link)
            link.click()
        })

export { exportApi }
