import { Injectable } from '@nestjs/common'
import generateId from 'src/common/helpers/generateId'
import { PrismaService } from 'src/prisma/prisma.service'
import { NewMessage } from './types/newMessage.type'


@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChatGroup(groupName: string) {
    return this.prisma.chat.create({
      data: {
        id: generateId('G'),
        title: groupName,
        type: 'group',
      },
    })
  }

  async createChatContact(title: string) {
    return this.prisma.chat.create({
      data: {
        id: generateId('C'),
        title: title,
        type: 'contact',
      },
    })
  }

  async getChatIdsByUserId(userId: string) {
    const chats = await this.prisma.participants.findMany({
      where: {
        userId,
      },
      select: {
        chatId: true,
      },
    })

    return chats.map((chat) => chat.chatId)
  }

  async saveMessage(message) {
    const newMessage = await this.prisma.message.create({
      data: {
        id: message.id,
        text: message.text,
        createdAt: message.createdAt,
        chatId: message.chatId,
        userId: message.userId,
        parentMessageId: message.parentMessageId ?? null,
      },
    })

    await this.prisma.participants.updateMany({
      where: {
        AND: [
          { chatId: message.chatId },
          {
            NOT: {
              userId: message.userId,
            },
          },
        ],
      },
      data: {
        unreadCount: { increment: 1 },
      },
    })

    return newMessage
  }

  async updateUnreadCount(userId: string, chatId: string) {
    const participant = await this.prisma.participants.findFirst({
      where: {
        AND: [{ chatId }, { userId }],
      },
    })

    return this.prisma.participants.update({
      where: { id: participant.id },
      data: {
        unreadCount: 0,
      },
    })
  }

  formatMessage(message: NewMessage) {
    return {
      ...message,
      id: generateId(),
      createdAt: new Date(),
    }
  }
}
