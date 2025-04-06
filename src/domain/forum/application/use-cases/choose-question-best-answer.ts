import { AnswerRepository } from '../repositories/answer-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface ChooseQuestionBestAnswerRequest {
  AnswerId: string
  AuthorId: string
}

type ChooseQuestionBestAnswerResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    question: Question
  }
>

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository
  ) {}

  async execute({
    AnswerId,
    AuthorId,
  }: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answerRepository.findById(AnswerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(
      answer.QuestionId.toString()
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (AuthorId !== question.AuthorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })
  }
}
