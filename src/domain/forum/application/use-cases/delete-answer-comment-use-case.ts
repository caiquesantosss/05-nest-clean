import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerCommentRequest {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment = await this.answerCommentRepository.findById(
      answerCommentId
    )

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentRepository.delete(answerComment)

    return right({})
  }
}
