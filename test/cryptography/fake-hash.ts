import { CompareHash } from '@/domain/forum/application/cryptography/compareHash'
import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenerator'

export class FakeHasher implements HashGenerator, CompareHash {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
