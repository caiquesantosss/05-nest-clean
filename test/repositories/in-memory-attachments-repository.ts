import { Student } from '../../src/domain/forum/enterprise/entities/student'
import { DomainEvents } from '../../src/core/events/domain-events'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentRepository {
    public items: Attachment[] = []
    
    async create(attachment: Attachment): Promise<void> {
        this.items.push(attachment)
    }

}
