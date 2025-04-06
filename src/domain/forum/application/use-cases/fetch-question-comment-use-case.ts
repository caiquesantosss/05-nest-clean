import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionCommentUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentUseCaseResponse = Either<
  null,
  {
    questionsComments: QuestionComment[]
  }
>

@Injectable()
export class FetchQuestionCommentUseCase {
  constructor(private questiosCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const questionsComments =
      await this.questiosCommentRepository.findManyQuestionId(questionId, {
        page,
      })

    return right({ questionsComments })
  }
}
