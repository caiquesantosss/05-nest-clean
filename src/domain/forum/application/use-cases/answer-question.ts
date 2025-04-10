import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'

interface AnswerQuestionRequest {
  authorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}

type AnswerQuestionResponse = Either<
  null,
  {
    answer: Answer
  }
>

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(authorId).toString(),
      questionId: new UniqueEntityId(questionId).toString(),
    })

    const answerAttachment = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId).toString(),
        answerId: answer.id.toString(),
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachment)

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
