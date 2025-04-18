import { PaginationParams } from '@/core/repositories/pagenations-params'
import { QuestionCommentRepository } from '../../src/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '../../src/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/values-object/comment-with-author'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  constructor(
    private studentRepository: InMemoryStudentRepository
  ) {}

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }
    return questionComment
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id
    )

    this.items.splice(itemIndex, 1)
  }

  async findManyQuestionId(questioId: string, params: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questioId)
      .slice((params.page - 1) * 20, params.page * 20)

    return questionComments
  }

  async findManyQuestionIdWithAuthor(questioId: string, params: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questioId)
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
          updatedAt: comment.updatedAt
        })
      })

    return questionComments
  }
}
