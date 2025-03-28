import { PaginationParams } from '@/core/repositories/pagenations-params'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findManyQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }
}
