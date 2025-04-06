import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { title } from 'process'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete Answer [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    answerFactory = moduleRef.get(AnswerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    await app.init()
  })

  test('[DELETE] /answer/:id', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const acessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.MakePrismaQuestion({
        authorId: user.id
    })

    const answer = await answerFactory.MakePrismaAnswer({
        questionId: question.id.toString(),
        authorId: user.id.toString()
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(204)
    const AnswerOnDatabase = await prisma.answer.findUnique({
        where: {
            id: answerId
        }
    })

    expect(AnswerOnDatabase).toBeNull()
  })
})
