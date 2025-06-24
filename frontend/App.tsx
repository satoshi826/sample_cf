import { useState, useRef, useEffect, useCallback } from 'react'
import { hc } from 'hono/client'
import type { HONO_API } from '../backend'
import type { Photo } from '../backend/routes/photo'
export const client = hc<HONO_API>(location.origin)

const fetchPhotos = async () => {
  const res = await client.api.photos.$get()
  if (!res.ok) throw new Error(`Error fetching photos: ${res.status} ${res.statusText}`)
  return res.json()
}

const postPhoto = async (image: File, title: string) => {
  const res = await client.api.photos.$post({ form: { image, title } })
  if (!res.ok) throw new Error(`Error uploading photo: ${res.status} ${res.statusText}`)
  return res.json()
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reloadPhotos = useCallback(() => fetchPhotos().then(setPhotos), [])
  useEffect(() => {
    reloadPhotos().catch(console.error)
  }, [reloadPhotos])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    try {
      setUploading(true)
      await postPhoto(selectedFile, `photo_${Date.now()}`)
      await reloadPhotos()
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const openImageModal = (photo: Photo) => {
    setSelectedImage(photo)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="stretch flex min-h-lvh flex-col gap-4 bg-[var(--surface)] p-4">
      <h1>Photo</h1>
      <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex cursor-pointer items-center justify-center rounded bg-gray-700 px-4 py-2 text-[var(--text)] transition-colors hover:bg-gray-600">
            <span>{selectedFile ? 'Change File' : 'Select Image'}</span>
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className={`rounded px-4 py-2 text-white ${
              !selectedFile
                ? 'cursor-not-allowed bg-gray-500'
                : uploading
                  ? 'bg-gray-600'
                  : 'bg-[var(--primary)] transition-colors hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {selectedFile && (
          <div className="mt-3">
            <p className="rounded bg-[var(--surface-lighter)] p-2 text-[var(--text)] text-sm">
              Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="border border-[var(--border)] bg-[var(--surface-lighter)] p-2">
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <img
              src={photo.url}
              alt={photo.title}
              className="mb-2 h-36 w-full cursor-pointer object-contain transition-opacity hover:opacity-80"
              onClick={() => openImageModal(photo)}
            />
            <p className="truncate text-[var(--text)]">{photo.title}</p>
          </div>
        ))}
      </div>
      {selectedImage && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={closeImageModal}>
          <div className="relative m-4 max-h-[90vh] w-full max-w-4xl">
            <img src={selectedImage.url} alt={selectedImage.title} className="mx-auto max-h-[90vh] max-w-full object-contain" />
            <div className="absolute right-0 bottom-0 left-0 bg-black bg-opacity-50 p-2 text-center text-white">{selectedImage.title}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
