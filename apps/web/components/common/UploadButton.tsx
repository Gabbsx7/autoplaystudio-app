import React from 'react'
interface UploadButtonProps {
  onSelect: (files: File[]) => void
  multiple?: boolean
}
const UploadButton: React.FC<UploadButtonProps> = ({
  onSelect,
  multiple = true,
}) => (
  <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white rounded shadow cursor-pointer">
    <input
      type="file"
      multiple={multiple}
      className="hidden"
      onChange={(e) => onSelect(Array.from(e.target.files ?? []))}
    />
    <span>Upload</span>
  </label>
)
export default UploadButton
