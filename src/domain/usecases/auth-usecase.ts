import ILoadUserRepository from '@/infra/repositories/load-user-repository-interface'
import { InvalidParamError, MissingParamError } from '@/utils/errors'

class AuthUseCase {
  constructor (private readonly loadUserRepository: ILoadUserRepository) { }

  async auth (email: string, password: string): Promise<string | null> {
    if (!email) { throw new MissingParamError('email') }
    if (!password) { throw new MissingParamError('password') }
    if (!this.loadUserRepository) { throw new MissingParamError('loadUserRepository') }
    if (!this.loadUserRepository.load) { throw new InvalidParamError('loadUserRepository') }

    const user = await this.loadUserRepository.load(email)
    if (!user) {
      return null
    }

    return null
  }
}

export default AuthUseCase
