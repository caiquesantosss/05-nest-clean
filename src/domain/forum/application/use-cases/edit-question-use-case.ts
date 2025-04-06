import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { QuestionAttachmentRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Injectable } from '@nestjs/common'

interface EditQuestionRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.AuthorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttchmenst =
      await this.questionAttachmentsRepository.findManyQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttchmenst
    )

    const questionAttachment = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId).toString(),
        questionId: question.id.toString(),
      })
    })

    questionAttachmentList.update(questionAttachment)

    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return right({ question })
  }
}
