import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  get(key: keyof Env) {
    return this.configService.get(key, { infer: true })
  }
}
