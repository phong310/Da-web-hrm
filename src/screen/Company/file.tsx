const readAsDataURL = (file: any) => {
  return new Promise((resolve, reject) => {
    const render = new FileReader()

    render.onload = (event) => {
      const base64Image = (event.target?.result as string) || ''
      resolve(base64Image)
    }

    render.onerror = (error) => {
      reject(error)
    }

    render.readAsDataURL(file)
  })
}
const parseFile = (base64Image: string) => {
  const byteCharacters = atob((base64Image as string).split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/jpeg' })
  const fileBlob = new File([blob], 'filename.jpg', { type: 'image/jpeg' })
  return fileBlob
}

const setLocalStorageCleanup = (itemName: string) => {
  setTimeout(() => {
    localStorage.removeItem(itemName)
  }, 30 * 60 * 1000) // 30 phút
}

export { readAsDataURL, parseFile, setLocalStorageCleanup }
