import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { jwtEncrypter } from './jwt-encrypter'
import { CompareHash } from '@/domain/forum/application/cryptography/compareHash'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenerator'

@Module({
  providers: [
    { provide: Encrypter, useClass: jwtEncrypter },
    { provide: CompareHash, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],

  exports: [Encrypter, CompareHash, HashGenerator],
})
export class CryptographyModule {}
