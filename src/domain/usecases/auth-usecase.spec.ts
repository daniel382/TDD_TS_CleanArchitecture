import ILoadUserRepository from '@/infra/repositories/load-user-repository-interface'
import { MissingParamError } from '@/utils/errors'

class AuthUseCase {
  constructor (private readonly loadUserRepository: ILoadUserRepository) { }

  async auth (email: string, password: string): Promise<string> {
    if (!email) { throw new MissingParamError('email') }
    if (!password) { throw new MissingParamError('password') }

    await this.loadUserRepository.load(email)

    return ''
  }
}

function makeSut (): any {
  const loadUserRepositorySpy = makeLoadUserRepositorySpy()
  const sut = new AuthUseCase(loadUserRepositorySpy)
  return { sut, loadUserRepositorySpy }
}

function makeLoadUserRepositorySpy (): any {
  class LoadUserRepositorySpy {
    email: string = ''

    async load (email: string): Promise<any> {
      this.email = email
      return {}
    }
  }

  return new LoadUserRepositorySpy()
}

describe('Auth UseCase', function () {
  it('should throws if no email is provided', function () {
    const { sut } = makeSut()
    const promise = sut.auth(null, null)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should throws if no password is provided', function () {
    const { sut } = makeSut()
    const promise = sut.auth('any@email.com', null)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('should call LoadUserRepository with correct email', async function () {
    const { sut, loadUserRepositorySpy } = makeSut()
    await sut.auth('any@email.com', 'any_password')
    expect(loadUserRepositorySpy.email).toBe('any@email.com')
  })
})
