import { Either, left, right } from './either'

function doSomenthing(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right('success')
  } else {
    return left('error')
  }
}

test('Success Result', () => {
  const result = doSomenthing(true)
  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error Result', () => {
  const result = doSomenthing(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
