import { MissingParamError } from '@/utils/errors'

class AuthUseCase {
  async auth (email: string, password: string): Promise<string> {
    if (!email) {
      throw new MissingParamError('email')
    }

    return ''
  }
}

function makeSut (): any {
  const sut = new AuthUseCase()
  return { sut }
}

describe('Auth UseCase', function () {
  it('should throws if no email is provided', function () {
    const { sut } = makeSut()
    const promise = sut.auth(null, null)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
