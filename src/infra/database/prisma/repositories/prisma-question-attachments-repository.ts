import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'

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

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length == 0) {
      return
    }

    const attachmentId = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentId,
        },
      },
    })
  }

  async deleteManyByQuesitonId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
