import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mappert'

@Injectable()
export class PrismaQuestionsAttachmentsRepository
  implements QuestionAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const QuestionAttachment = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return QuestionAttachment.map(PrismaQuestionAttachmentMapper.toDomain)
  }
  async deleteManyByQuesitonId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
