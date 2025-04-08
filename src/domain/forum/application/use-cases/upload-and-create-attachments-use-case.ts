import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentsRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentsResponse = Either<
  InvalidAttachmentType,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentsUseCase {
  constructor(
    private attachmentRepository: AttachmentRepository,
    private uploader: Uploader
) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentsRequest): Promise<UploadAndCreateAttachmentsResponse> {
    if (!/^image\/(jpeg|png|jpg)$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType))
    }

    const { url } = await this.uploader.upload({
        fileName, 
        fileType, 
        body
    }) 

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
