import ILoadUserRepository from '@/infra/repositories/load-user-repository-interface'
import { InvalidParamError, MissingParamError } from '@/utils/errors'

class AuthUseCase {
  constructor (
    private readonly loadUserRepository: ILoadUserRepository,
    private readonly encrypterSpy: any
  ) { }

  async auth (email: string, password: string): Promise<string | null> {
    if (!email) { throw new MissingParamError('email') }
    if (!password) { throw new MissingParamError('password') }

    if (!this.loadUserRepository) { throw new MissingParamError('loadUserRepository') }
    if (!this.loadUserRepository.load) { throw new InvalidParamError('loadUserRepository') }
    if (!this.encrypterSpy) { throw new MissingParamError('encrypterSpy') }
    if (!this.encrypterSpy.compare) { throw new InvalidParamError('encrypterSpy') }

    const user = await this.loadUserRepository.load(email)
    if (!user) {
      return null
    }

    await this.encrypterSpy.compare(password, user.password)

    return null
  }
}

export default AuthUseCase
