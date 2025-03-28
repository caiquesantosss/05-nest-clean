import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '../../src/domain/forum/enterprise/entities/answer-attachment'

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
