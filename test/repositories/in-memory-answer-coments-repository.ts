import { PaginationParams } from '@/core/repositories/pagenations-params'
import { AnswerCommentRepository } from '../../src/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '../../src/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

  async create(answerCommment: AnswerComment) {
    this.items.push(answerCommment)
  }

  async findById(id: string) {
    const answerCommment = this.items.find((item) => item.id.toString() === id)

    if (!answerCommment) {
      return null
    }
    return answerCommment
  }

  async delete(answerCommment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerCommment.id
    )

    this.items.splice(itemIndex, 1)
  }

  async findManyAnswerId(answerId: string, params: PaginationParams) {
      const answerComments = this.items
        .filter((item) => item.answerId.toString() === answerId)
        .slice((params.page - 1) * 20, params.page * 20)
  
      return answerComments
    }
}
