import { Slug } from '@/domain/forum/enterprise/entities/values-object/slug'
import { QuestionRepository } from '../../src/domain/forum/application/repositories/question-repository'
import { Question } from '../../src/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagenations-params'
import { DomainEvents } from '../../src/core/events/domain-events'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/values-object/question-details'

export class InMemoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentRepository: InMemoryAttachmentsRepository,
    private studentRepository: InMemoryStudentRepository
  ) {}

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(`Author with ID ${question.authorId} not found.`)
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachments) => {
        return questionAttachments.questionId.equals(question.id)
      }
    )

    const attachments = questionAttachments.map((questionAttachments) => {
      const attachment = this.attachmentRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachments.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID ${questionAttachments.attachmentId} not found.`
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      attachments,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems()
    )

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    await this.questionAttachmentRepository.deleteManyByQuesitonId(
      question.id.toString()
    )
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }
}
