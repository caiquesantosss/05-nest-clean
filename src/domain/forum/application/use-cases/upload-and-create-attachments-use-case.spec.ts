import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hash'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentsUseCase } from './upload-and-create-attachments-use-case'
import { FakeUploader } from 'test/storage/fake-upoloader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakerUploader: FakeUploader
let sut: UploadAndCreateAttachmentsUseCase

describe('Upload a attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakerUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentsUseCase(
      inMemoryAttachmentsRepository,
      fakerUploader
    )
  })

  it('should be to able upload an attachment', async () => {
    const result = await sut.execute({
     fileName: 'image.png', 
     fileType: 'image/png', 
     body: Buffer.from('')
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakerUploader.uploads).toHaveLength(1)
    expect(fakerUploader.uploads[0]).toEqual(
        expect.objectContaining({
            fileName: 'image.png'
        })
    )
  })

  it('should not be able upload an attachment invalid fie type', async () => {
    const result = await sut.execute({
        fileName: 'audio.mp3', 
        fileType: 'audio/mp3', 
        body: Buffer.from('')
       })
   
       expect(result.isLeft()).toBe(true)
       expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })

})
