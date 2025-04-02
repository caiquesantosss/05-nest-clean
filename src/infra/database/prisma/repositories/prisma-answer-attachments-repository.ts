import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const AnswerAttachment = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return AnswerAttachment.map(PrismaAnswerAttachmentMapper.toDomain)
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
