import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Question Answers [E2E]', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionCommentFactory: QuestionCommentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    await app.init()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const acessToken = jwt.sign({ sub: user.id.toValue() })

    const question = await questionFactory.MakePrismaQuestion({
      authorId: user.id,
    })

    await Promise.all([
        questionCommentFactory.MakePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 01',
      }),
      questionCommentFactory.MakePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 02',
      }),
    ])

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)  
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questionComments).toEqual(
      expect.arrayContaining([
          expect.objectContaining({ content: 'Comment 02' }),
          expect.objectContaining({ content: 'Comment 01' }),
      ])
    )
  })
})
