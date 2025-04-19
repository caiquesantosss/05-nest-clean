import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { MakeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { EditQuestionUseCase } from './edit-question-use-case'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudenRepository: InMemoryStudentRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
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
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentRepository
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      })
    )

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'Pergunta teste',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '3'],
    })

    const updatedQuestion = inMemoryQuestionsRepository.items[0]

    expect(updatedQuestion.title).toBe('Pergunta teste')
    expect(updatedQuestion.content).toBe('Conteúdo da pergunta')

    expect(updatedQuestion).toMatchObject({
      title: 'Pergunta teste',
      content: 'Conteúdo da pergunta',
    })

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({
        props: expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
      }),
    ])
  })

  it('should not be able to edit a question', async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-2',
      title: 'Pergunta teste',
      content: 'Conteúdo da pergunta',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and remove attachments when editing a question', async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      })
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'Pergunta teste',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: new UniqueEntityId('1'),
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: new UniqueEntityId('3'),
          }),
        }),
      ])
    )
  })
})
