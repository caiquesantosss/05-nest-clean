import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

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

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    const questionAttachment = attachmentsIds.map(attachmentId  => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId).toString(), 
        questionId: question.id.toString()
      })
    })
    
    question.attachments = new QuestionAttachmentList(questionAttachment)

    await this.questionRepository.create(question)

    return right({ question })
  }
}
