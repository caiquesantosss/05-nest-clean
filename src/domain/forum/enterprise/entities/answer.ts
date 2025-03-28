import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../../application/event/answer-created-event'

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  attachments: AnswerAttachmentList
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get AuthorId() {
    return this.props.authorId
  }

  get QuestionId() {
    return this.props.questionId
  }

  get Content() {
    return this.props.content
  }

  get CreatedAt() {
    return this.props.createdAt
  }

  get attachments() {
    return this.props.attachments
  }

  get UpdateAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.Content.substring(0, 120).trim().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
