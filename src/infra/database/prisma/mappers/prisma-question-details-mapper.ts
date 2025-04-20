import { UniqueEntityId } from '@/core/entities/unique-entity'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/values-object/comment-with-author'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/values-object/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/values-object/slug'
import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      title: raw.title,
      slug: Slug.create(raw.slug),
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      content: raw.content,
      author: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updateAt,
    })
  }
}
