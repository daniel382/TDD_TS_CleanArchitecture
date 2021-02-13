import ILoadUserRepository from '@/infra/repositories/load-user-repository-interface'
import { InvalidParamError, MissingParamError } from '@/utils/errors'
import AuthUseCase from './auth-usecase'

function makeSut (): any {
  const loadUserRepositorySpy = makeLoadUserRepositorySpy()
  const sut = new AuthUseCase(loadUserRepositorySpy)
  return { sut, loadUserRepositorySpy }
}

function makeLoadUserRepositorySpy (): any {
  class LoadUserRepositorySpy {
    email: string = ''
    user: any = {}

    async load (email: string): Promise<any> {
      this.email = email
      return this.user
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

  it('should throws if no LoadUserRepository is provided', function () {
    const sut = new AuthUseCase(null as unknown as ILoadUserRepository)

    const promise = sut.auth('any@email.com', 'any_password')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new MissingParamError('loadUserRepository'))
  })

  it('should throws if LoadUserRepository has no load method', function () {
    const sut = new AuthUseCase({} as unknown as ILoadUserRepository)

    const promise = sut.auth('any@email.com', 'any_password')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserRepository'))
  })

  it('should return null if an invalid email is provided', async function () {
    const { sut, loadUserRepositorySpy } = makeSut()
    loadUserRepositorySpy.user = null
    const accessToken = await sut.auth('invalid@email.com', 'any_password')
    expect(accessToken).toBeNull()
  })
})
