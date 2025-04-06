import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Question Answers [E2E]', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    await app.init()
  })

  test('[GET] /answer/:answerId/comments', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const acessToken = jwt.sign({ sub: user.id.toValue() })

    const question = await questionFactory.MakePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.MakePrismaAnswer({
        authorId: user.id.toString(), 
        questionId: question.id.toString()
    })

    await Promise.all([
        answerCommentFactory.MakePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: 'Comment 01',
      }),
      answerCommentFactory.MakePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: 'Comment 02',
      }),
    ])

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/answer/${answerId}/comments`)  
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.answerComments).toEqual(
      expect.arrayContaining([
          expect.objectContaining({ content: 'Comment 02' }),
          expect.objectContaining({ content: 'Comment 01' }),
      ])
    )
  })
})
