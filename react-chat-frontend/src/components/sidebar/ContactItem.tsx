import Badge from '@components/common/Badge'
import useMessages from '@hooks/useMessages'
import useUiStore from '@store/uiStore'
import formatLastMsgTime from '@utils/formatLastMsgTime'
import formatTime from '@utils/formatTime'
import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ContextMenu from './ContextMenu'

type Props = {
  id: string
  title: string
  avatar: string | null
  unreadCount?: number
  setClickedItem: (id: string | null) => void
  clickedItem: string | null
}

const ContactItem = ({ id, title, avatar, unreadCount, setClickedItem, clickedItem }: Props) => {
  const router = useRouter()
  const activeChat = router.query.username ? router.query.username[0] : null
  const [isOpen, setIsOpen] = useState(false)
  const [posXY, setPosXY] = useState({ x: 0, y: 0 })

  const { messages, isLoading } = useMessages(title)
  const { openChat } = useUiStore(state => ({
    openChat: state.openChat,
  }))

  const handleOpenChat = (username: string) => {
    openChat()
    router.push(`/chat/${username}`, undefined, { shallow: true })
  }

  function handleOpenContext(e: any) {
    e.preventDefault()

    setClickedItem(id)
    setPosXY({ x: e.clientX, y: e.clientY })
  }

  function handleCloseContext() {
    setClickedItem(null)
    setPosXY({ x: 0, y: 0 })
  }

  function getLastMessage(messages: any) {
    if (messages?.length > 0) {
      return messages[messages.length - 1].text
    }
    return ''
  }

  function getLastMessageTime(messages: any) {
    if (messages?.length > 0) {
      let time = messages[messages.length - 1].createdAt
      return formatLastMsgTime(time)
    }
    return ''
  }

  return (
    <>
      <button
        onClick={() => handleOpenChat(title)}
        onContextMenu={handleOpenContext}
        id='chat-item'
        className={`w-full p-2 rounded-lg cursor-pointer  flex gap-2 ${
          title === activeChat ? 'bg-active-item-color text-white' : 'hover:bg-chat-hover-color'
        }`}>
        <img src={avatar ? avatar : '/user.svg'} className='w-12 h-12' alt={'test'} />
        <div className='w-full'>
          <div className='flex justify-between'>
            <div className={`font-medium ${title === activeChat ? 'text-white' : 'text-text-color'}`}>{title}</div>
            <div className={`text-xs  ${title === activeChat ? 'text-white' : 'text-gray-500'}`}>
              {getLastMessageTime(messages)}
            </div>
          </div>
          <div className='flex justify-between'>
            <div className={`text-left ${title === activeChat ? 'text-white' : 'text-gray-500'}`}>
              {getLastMessage(messages)}
            </div>
            {unreadCount && unreadCount > 0 ? <Badge>{unreadCount}</Badge> : null}
          </div>
        </div>
      </button>
      {clickedItem === id &&
        createPortal(
          <ContextMenu xPos={posXY.x} yPos={posXY.y} handleCloseContext={handleCloseContext} />,
          document.getElementById('portals') as Element
        )}
    </>
  )
}

export default ContactItem
