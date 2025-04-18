import { Comment } from '@/domain/forum/enterprise/entities/comment'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/values-object/comment-with-author'
import { create } from 'domain'

export class CommentWithAuthorPresenter {
  static toHttp(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.author,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
    }
  }
}
