import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from './answer-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return new UniqueEntityId(a.attachmentId).equals(
      new UniqueEntityId(b.attachmentId)
    )
  }
}
