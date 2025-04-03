import {
  Question,
  QuestionProps,
} from '../../src/domain/forum/enterprise/entities/question'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'

export function MakeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async MakePrismaQuestion(
    data: Partial<QuestionProps> = {}
  ): Promise<Question> {
    const Question = MakeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(Question),
    })

    return Question
  }
}
