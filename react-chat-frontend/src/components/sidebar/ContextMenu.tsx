import { Portal } from '@components/ui-kit'
import { MenuItem } from '@components/ui-kit/Menu/Menu'
import useClickOutside from '@hooks/useClickOutside'
import React, { useRef } from 'react'
import { IoFolderOpenOutline, IoTrashBinOutline } from 'react-icons/io5'
import { MdOutlineMarkEmailRead } from 'react-icons/md'

const ContextMenu = ({
  xPos,
  yPos,
  handleCloseContext,
}: {
  xPos: number
  yPos: number
  handleCloseContext: () => void
}) => {
  const contextRef = useRef<HTMLDivElement | null>(null)
  useClickOutside(contextRef, handleCloseContext)

  return (
    <Portal>
      <div
        style={{ top: yPos, left: xPos }}
        ref={contextRef}
        className={`rounded-md absolute py-2 px-2 dropdown-shadow text-text-color border-gray-300`}>
        <MenuItem icon={<IoFolderOpenOutline size='20' />}>Add to folder</MenuItem>
        <MenuItem icon={<MdOutlineMarkEmailRead size='20' />}>Mark as read</MenuItem>
        <MenuItem icon={<IoTrashBinOutline size='20' color='#DC2626' />} className='text-red-600'>
          Remove
        </MenuItem>
      </div>
    </Portal>
  )
}

export default ContextMenu
