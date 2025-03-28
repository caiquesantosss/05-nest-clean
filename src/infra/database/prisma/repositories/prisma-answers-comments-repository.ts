import { PaginationParams } from '@/core/repositories/pagenations-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentRepository {
  create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findManyAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }
  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
