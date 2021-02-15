import ILoadUserRepository from '@/infra/repositories/load-user-repository-interface'
import IEncrypter from '@/utils/encrypter-interface'
import ITokenGenerator from '@/utils/token-generator-interface'
import IUpdateAccessTokenRepository from '@/utils/update-access-token-repository-interface'
import { InvalidParamError, MissingParamError } from '@/utils/errors'

class AuthUseCase {
  constructor (
    private readonly loadUserRepository: ILoadUserRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
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

    const isPasswordOk = user && await this.encrypter.compare(password, user.password)
    if (!isPasswordOk) { return null }

    const accessToken = await this.tokenGenerator.generateToken(user._id)
    const isAccessTokenOk = accessToken && await this.updateAccessTokenRepository
      .updateUserAccessToken(user._id, accessToken)

    if (!isAccessTokenOk) { return null }

    return accessToken
  }
}

export default AuthUseCase
