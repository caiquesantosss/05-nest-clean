import { hash, compare } from 'bcryptjs'

import { CompareHash } from '@/domain/forum/application/cryptography/compareHash'
import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenerator'

export class BcryptHasher implements HashGenerator, CompareHash {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
