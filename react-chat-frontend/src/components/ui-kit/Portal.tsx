import React from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
  target?: Element | DocumentFragment
}

const Portal = ({ children, target }: PortalProps) => {
  let container = target ? target : (document.getElementById('portals') as Element)

  return <>{createPortal(children, container)}</>
}

export default Portal
