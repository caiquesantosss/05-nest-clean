import { PaginationParams } from '@/core/repositories/pagenations-params'
import { AnswerCommentRepository } from '../../src/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '../../src/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/values-object/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

  constructor(private studentRepository: InMemoryStudentRepository) {}

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

  async findManyAnswerIdWithAuthor(answerId: string, params: PaginationParams) {
    const answerComents = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((comment) => {
        const author = this.studentRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(`Author with ID ${comment.authorId} not found.`)
        }

        return CommentWithAuthor.create({
          author: author.name,
          authorId: comment.authorId,
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return answerComents
  }
}
