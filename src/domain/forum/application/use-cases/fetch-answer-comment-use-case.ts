import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { Injectable } from '@nestjs/common'

interface FetchAnswerCommentUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

@Injectable()
export class FetchAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findManyAnswerId(
      answerId,
      {
        page,
      }
    )

    return right({ answerComments })
  }
}
