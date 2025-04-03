import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import { QuestionAttachment, QuestionAttachmentProps } from '../../src/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-question-attachment-mappert'

export function MakeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const questionComment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityId().toString(),
      attachmentId: new UniqueEntityId().toString(),
      ...override,
    },
    id
  )

  return questionComment
}

