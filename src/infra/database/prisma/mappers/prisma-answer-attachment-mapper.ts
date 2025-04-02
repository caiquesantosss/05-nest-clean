import { UniqueEntityId } from '@/core/entities/unique-entity'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id).toString(),
        answerId: new UniqueEntityId(raw.answerId).toString(),
      },
      new UniqueEntityId(raw.id)
    )
  }
}
