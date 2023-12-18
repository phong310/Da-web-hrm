import { FileUploader } from 'react-drag-drop-files'

type UploadFilesProps = {
  files: Array<any>
  setFiles: (s: any) => void
  acceptedFiles?: Array<string>
  filesLimit: number
  props?: any
}

export const UploadFiles = ({ files, setFiles, acceptedFiles }: UploadFilesProps) => {
  const handleChange = (file: any) => {
    setFiles(file)
  }

  return (
    <>
      <FileUploader handleChange={handleChange} name="file" types={acceptedFiles} />
      {files ? (
        <img
          style={{ minWidth: 200, maxWidth: 508 }}
          //@ts-ignore
          src={files.type ? URL.createObjectURL(files) : files}
        />
      ) : (
        'No files uploaded yet'
      )}
    </>
  )
}
