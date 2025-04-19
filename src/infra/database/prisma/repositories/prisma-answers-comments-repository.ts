import { PaginationParams } from '@/core/repositories/pagenations-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaService } from '../prisma.service'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/values-object/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentRepository {
  constructor(private prisma: PrismaService) {}
  
    async create(answerComment: AnswerComment): Promise<void> {
      const data = PrismaAnswerCommentMapper.toPrisma(answerComment)
  
      await this.prisma.comment.create({
        data,
      })
    }
  
    async findById(id: string): Promise<AnswerComment | null> {
      const answerComment = await this.prisma.comment.findUnique({
        where: {
          id,
        },
      })
  
      if (!answerComment) {
        return null
      }
  
      return PrismaAnswerCommentMapper.toDomain(answerComment)
    }

     async findManyAnswerIdWithAuthor(
        answerId: string,
        { page }: PaginationParams
      ): Promise<CommentWithAuthor[]> {
        const answers = await this.prisma.comment.findMany({
          where: {
            answerId,
          },
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
          skip: (page - 1) * 20,
        })
    
        return answers.map(PrismaCommentWithAuthorMapper.toDomain)
      }
  
    async findManyAnswerId(
      answerId: string,
      { page }: PaginationParams
    ): Promise<AnswerComment[]> {
      const answers = await this.prisma.comment.findMany({
        where: {
          answerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
        skip: (page - 1) * 20,
      })
  
      return answers.map(PrismaAnswerCommentMapper.toDomain)
    }
  
    async delete(answerComment: AnswerComment): Promise<void> {
      await this.prisma.comment.delete({
        where: {
          id: answerComment.id.toString(),
        },
      })
    }
}
