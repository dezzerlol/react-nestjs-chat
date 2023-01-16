export type Folder = {
  name: string
  id: string
  contacts: Contact[]
  groups: Group[]
}

export type Contact = {
  id: string
  username: string
  avatar: string | null
  messages: string[]
}

export type Group = {
  id: string
  name: string
  avatar: string
  users: Pick<User, 'id' | 'username' | 'avatar'>[]
  messages: string[]
}

export type User = {
  id: string
  avatar: string
  username: string
  contacts: Contact[]
  folders: Folder[]
  groups: Group[]
}
