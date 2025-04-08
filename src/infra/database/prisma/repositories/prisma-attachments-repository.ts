import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}
