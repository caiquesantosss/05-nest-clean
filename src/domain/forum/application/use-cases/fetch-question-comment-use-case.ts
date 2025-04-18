import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/values-object/comment-with-author'

interface FetchQuestionCommentUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentUseCase {
  constructor(private questiosCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const comments =
      await this.questiosCommentRepository.findManyQuestionIdWithAuthor(
        questionId,
        {
          page,
        }
      )

    return right({ comments })
  }
}
