import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '../../src/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'

export function MakeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const answerComment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId().toString(),
      attachmentId: new UniqueEntityId().toString(),
      ...override,
    },
    id
  )

  return answerComment
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = MakeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    })

    return answerAttachment
  }
}