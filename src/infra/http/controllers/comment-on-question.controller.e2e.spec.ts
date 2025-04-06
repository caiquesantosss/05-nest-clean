import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Comment On Question [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    await app.init()
  })

  test('[POST] /questions/:questionId/comments', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const acessToken = jwt.sign({ sub: user.id.toString() })

    
    const question = await questionFactory.MakePrismaQuestion({
        authorId: user.id
    })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/question/${questionId}/comments`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send({
        content: 'New Comment',
      })

    expect(response.statusCode).toBe(201)
    const CommentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New Comment'
      },
    })

    expect(CommentOnDatabase).toBeTruthy()
  })
})
