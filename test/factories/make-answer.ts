import {
  Answer,
  AnswerProps,
} from '../../src/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import { faker } from '@faker-js/faker'

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
