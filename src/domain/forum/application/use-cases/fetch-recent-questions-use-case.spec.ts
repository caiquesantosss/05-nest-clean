import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { MakeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionUseCaseUseCase } from './fetch-recent-questions-use-case'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudenRepository: InMemoryStudentRepository
let sut: FetchRecentQuestionUseCaseUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudenRepository = new InMemoryStudentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudenRepository
    )
    sut = new FetchRecentQuestionUseCaseUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch a recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      MakeQuestion({ createdAt: new Date(2022, 0, 20) })
    )
    await inMemoryQuestionsRepository.create(
      MakeQuestion({ createdAt: new Date(2022, 0, 18) })
    )
    await inMemoryQuestionsRepository.create(
      MakeQuestion({ createdAt: new Date(2022, 0, 23) })
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch pagineted recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(MakeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
