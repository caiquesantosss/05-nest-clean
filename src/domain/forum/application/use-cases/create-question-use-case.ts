import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'
import { QuestionAttachmentRepository } from '../repositories/question-attachments-repository'

interface CreateQuestionRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionResponse = Either<
  null,
  {
    question: Question
  }
>

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository
  ) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content
    })

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionRepository.create(question)

    await this.questionAttachmentsRepository.createMany(questionAttachments)

    return right({ question })
  }
}
