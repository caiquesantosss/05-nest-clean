import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { Slug } from './values-object/slug'
import { UniqueEntityId } from '../../../../core/entities/unique-entity'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../../application/event/question-best-answer-choosen-event'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  attachments: QuestionAttachmentList
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get AuthorId() {
    return this.props.authorId
  }

  get BestAnswerId() {
    return this.props.bestAnswerId
  }

  get attachments() {
    return this.props.attachments
  }

  get Title() {
    return this.props.title
  }

  get Content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get CreatedAt() {
    return this.props.createdAt
  }

  get UpdateAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.CreatedAt, 'days') <= 3
  }

  get excerpt() {
    return this.Content.substring(0, 120).trim().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId === undefined) {
      return
    }

    if (
      this.props.bestAnswerId !== undefined &&
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return question
  }
}
