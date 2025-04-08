import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaQuestionsCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-student-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachments-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionsCommentsRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionsAttachmentsRepository,
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswerRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentsRepository, 
    },
    {
      provide: AttachmentRepository, 
      useClass: PrismaAttachmentRepository
    }
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    AnswerCommentRepository,
    AnswerAttachmentRepository,
    AttachmentRepository
  ],
})
export class DatabaseModule {}
