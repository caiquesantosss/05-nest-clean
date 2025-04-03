import {
  Answer,
  AnswerProps,
} from '../../src/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'

export function MakeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId().toString(),
      questionId: new UniqueEntityId().toString(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  )

  return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async MakePrismaAnswer(
    data: Partial<AnswerProps> = {}
  ): Promise<Answer> {
    const Answer = MakeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(Answer),
    })

    return Answer
  }
}