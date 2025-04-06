import { UniqueEntityId } from '@/core/entities/unique-entity'
import { QuestionRepository } from '../repositories/question-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerRepository } from '../repositories/answer-repository'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface CommentOnAnswerRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerCommentRepository: AnswerCommentRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)

    return right({ answerComment })
  }
}
