import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Authenticate [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studenFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studenFactory = moduleRef.get(StudentFactory)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    await studenFactory.MakePrismaStudent({
      email: 'ZVt9y@example.com',
      password: await hash('123456', 8)
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'ZVt9y@example.com',
      password: '123456',
    })

    expect(response.body).toEqual({
      acess_token: expect.any(String),
    })
  })
})
