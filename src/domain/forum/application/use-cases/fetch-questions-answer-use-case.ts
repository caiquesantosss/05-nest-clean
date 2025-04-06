import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionAnswerUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswerUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
export class FetchQuestionAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswerUseCaseRequest): Promise<FetchQuestionAnswerUseCaseResponse> {
    const answers = await this.answerRepository.findManyAnswersId(questionId, {
      page,
    })

    return right({ answers })
  }
}
