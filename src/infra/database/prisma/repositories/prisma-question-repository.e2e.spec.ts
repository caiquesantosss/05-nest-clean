import { Slug } from '@/domain/forum/enterprise/entities/values-object/slug'
import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { empty } from '@prisma/client/runtime/library'
import { only } from 'node:test'

describe('Prisma Questions Repository', () => {
  let app: INestApplication
  let cacheRepository: CacheRepository
  let questionRepository: QuestionRepository
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionRepository = moduleRef.get(QuestionRepository)

    await app.init()
  })

  it('should cache question result', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const question = await questionFactory.MakePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    const questionDetails = await questionRepository.findDetailsBySlug(slug)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    if (!cached) {
      throw new Error('Cached not found')
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      })
    )
  })

  it.only('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const question = await questionFactory.MakePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    let cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()

    await questionRepository.findDetailsBySlug(slug)

    cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).not.toBeNull()

    if (!cached) {
      throw new Error('Cached not found')
    }

    const questionDetails = await questionRepository.findDetailsBySlug(slug)

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      })
    )
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const question = await questionFactory.MakePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true })
    )

    await questionRepository.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
