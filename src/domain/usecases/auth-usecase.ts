import ILoadUserRepository from '@/infra/repositories/load-user-repository-interface'
import { InvalidParamError, MissingParamError } from '@/utils/errors'

class AuthUseCase {
  constructor (
    private readonly loadUserRepository: ILoadUserRepository,
    private readonly encrypter: any,
    private readonly tokenGenerator: any
  ) { }

  async auth (email: string, password: string): Promise<string | null> {
    if (!email) { throw new MissingParamError('email') }
    if (!password) { throw new MissingParamError('password') }

    if (!this.loadUserRepository) { throw new MissingParamError('loadUserRepository') }
    if (!this.loadUserRepository.load) { throw new InvalidParamError('loadUserRepository') }
    if (!this.encrypter) { throw new MissingParamError('encrypterSpy') }
    if (!this.encrypter.compare) { throw new InvalidParamError('encrypterSpy') }
    if (!this.tokenGenerator) { throw new MissingParamError('tokenGenerator') }
    if (!this.tokenGenerator.generateToken) { throw new InvalidParamError('tokenGenerator') }

    const user = await this.loadUserRepository.load(email)
    if (!user) { return null }

    const isEqual = await this.encrypter.compare(password, user.password)
    if (!isEqual) { return null }

    await this.tokenGenerator.generateToken(user._id)

    return 'any_token'
  }
}

export default AuthUseCase
