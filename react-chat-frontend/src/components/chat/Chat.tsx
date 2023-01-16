import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useUser from '@hooks/useUser'
import useUiStore from '@store/uiStore'
import ChatHeader from './header/ChatHeader'
import ChatInput from './input/ChatInput'
import MessagesContainer from './messages/MessagesContainer'
import { Panel } from 'react-resizable-panels'

const Chat = () => {
  const router = useRouter()
  const { user, error, isError, isLoading } = useUser()
  const openedChatQuery = router.query.username ? router.query.username[0] : null
  const { isChatOpen, openChat, closeChat } = useUiStore(state => ({
    isChatOpen: state.isChatOpen,
    openChat: state.openChat,
    closeChat: state.closeChat,
  }))

  console.log({ user })
  const activeChat = user?.contacts.find(chat => chat.username === openedChatQuery)

  useEffect(() => {
    if (!activeChat) return

    openChat()

    return () => closeChat()
  }, [activeChat])

  if (!activeChat) {
    return (
      <Panel
        className={`w-full h-full flex flex-col bg-chat-box-background-color ${
          isChatOpen ? 'absolute md:relative' : 'hidden md:block'
        }`}></Panel>
    )
  }

  return (
    <Panel
      className={`w-full h-full flex flex-col bg-chat-box-background-color ${
        isChatOpen ? 'absolute md:relative' : 'hidden'
      }`}>
      <ChatHeader activeChat={activeChat} />
      <div
        id='chat-box'
        className='flex flex-col-reverse items-center w-full h-full py-4 px-4 md:px-0 overflow-y-auto max-h-[calc(100%-130px)] '>
        <MessagesContainer />
        <ChatInput activeChat={activeChat} />
      </div>
    </Panel>
  )
}

export default Chat
