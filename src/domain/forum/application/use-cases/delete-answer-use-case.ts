import { Either, left, right } from '@/core/either'
import { AnswerRepository } from '../repositories/answer-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.AuthorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return right({})
  }
}
