import ILoadUserRepository from '@/infra/repositories/load-user-repository-interface'
import IEncrypter from '@/utils/encrypter-interface'
import { InvalidParamError, MissingParamError } from '@/utils/errors'
import ITokenGenerator from '@/utils/token-generator-interface'
import IUpdateAccessTokenRepository from '@/utils/update-access-token-repository-interface'
import AuthUseCase from './auth-usecase'

function makeSut (): any {
  const loadUserRepositorySpy = makeLoadUserRepositorySpy()
  const encrypterSpy = makeEncrypterSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()

  const sut = new AuthUseCase(
    loadUserRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  )

  return {
    sut,
    loadUserRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
}

function makeLoadUserRepositorySpy (): any {
  class LoadUserRepositorySpy {
    email: string = ''
    user: any = {
      _id: 'any_id',
      password: 'hashed_password'
    }

    async load (email: string): Promise<any> {
      this.email = email
      return this.user
    }
  }

  return new LoadUserRepositorySpy()
}

function makeLoadUserRepositorySpyWithThrow (): any {
  class LoadUserRepositorySpy {
    async load (email: string): Promise<any> {
      throw new Error()
    }
  }

  return new LoadUserRepositorySpy()
}

function makeEncrypterSpy (): any {
  class EncrypterSpy {
    password: string = ''
    hashedPassword: string = ''
    isEqual: boolean = true

    async compare (password: string, hashedPassword: string): Promise<boolean> {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isEqual
    }
  }

  return new EncrypterSpy()
}

function makeEncrypterSpyWithThrow (): any {
  class EncrypterSpy {
    async compare (password: string, hashedPassword: string): Promise<boolean> {
      throw new Error()
    }
  }

  return new EncrypterSpy()
}

function makeTokenGeneratorSpy (): any {
  class TokenGeneratorSpy {
    userId: string = ''
    accessToken: string = 'any_token'

    async generateToken (userId: string): Promise<string> {
      this.userId = userId

      return this.accessToken
    }
  }

  return new TokenGeneratorSpy()
}

function makeTokenGeneratorSpyWithThrow (): any {
  class TokenGeneratorSpy {
    async generateToken (userId: string): Promise<string> {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

function makeUpdateAccessTokenRepositorySpy (): any {
  class UpdateAccessTokenRepositorySpy {
    userId: string = ''
    accessToken: string = ''
    isUpdated: boolean = true

    async updateUserAccessToken (userId: string, accessToken: string): Promise<boolean> {
      this.userId = userId
      this.accessToken = accessToken
      return this.isUpdated
    }
  }

  return new UpdateAccessTokenRepositorySpy()
}

function makeUpdateAccessTokenRepositorySpyWithThrow (): any {
  class UpdateAccessTokenRepositorySpyWithThrow {
    async updateUserAccessToken (userId: string, accessToken: string): Promise<boolean> {
      throw new Error()
    }
  }

  return new UpdateAccessTokenRepositorySpyWithThrow()
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

  it('should throws if LoadUserRepository has no load method', function () {
    const encrypterSpy = makeEncrypterSpy()
    const tokenGeneratorSpy = makeTokenGeneratorSpy()
    const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()
    const sut = new AuthUseCase(
      {} as unknown as ILoadUserRepository,
      encrypterSpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy
    )

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

  it('should return null if an invalid password is provided', async function () {
    const { sut, encrypterSpy } = makeSut()

    encrypterSpy.isEqual = false
    const accessToken = await sut.auth('any@email.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  it('should call Encrypter with correct values', async function () {
    const { sut, loadUserRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('any@email.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserRepositorySpy.user.password)
  })

  it('should throws if Encrypter has no compare method', function () {
    const loadUserRepository = makeLoadUserRepositorySpy()
    const tokenGeneratorSpy = makeTokenGeneratorSpy()
    const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()
    const sut = new AuthUseCase(
      loadUserRepository,
      {} as unknown as IEncrypter,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy
    )

    const promise = sut.auth('any@email.com', 'any_password')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new InvalidParamError('encrypterSpy'))
  })

  it('should call TokenGenerator with correct userId', async function () {
    const { sut, loadUserRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('any@email.com', 'any_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserRepositorySpy.user._id)
  })

  it('should throws if TokenGenerator has no compare method', function () {
    const loadUserRepository = makeLoadUserRepositorySpy()
    const encrypter = makeEncrypterSpy()
    const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()
    const sut = new AuthUseCase(
      loadUserRepository,
      encrypter,
      {} as unknown as ITokenGenerator,
      updateAccessTokenRepositorySpy
    )

    const promise = sut.auth('any@email.com', 'any_password')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new InvalidParamError('tokenGenerator'))
  })

  it('should return a access token if valid credentials are provided', async function () {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('any@email.com', 'any_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  it('should call UpdateAccessTokenRepository with correct values', async function () {
    const {
      sut,
      loadUserRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy
    } = makeSut()

    await sut.auth('any@email.com', 'any_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserRepositorySpy.user._id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  it('should throw if any dependency throws', function () {
    const loadUserRepositorySpy = makeLoadUserRepositorySpy()
    const encrypterSpy = makeEncrypterSpy()
    const tokenGeneratorSpy = makeTokenGeneratorSpy()
    const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()

    const suts = new Array<AuthUseCase>().concat(
      new AuthUseCase(
        makeLoadUserRepositorySpyWithThrow(),
        encrypterSpy,
        tokenGeneratorSpy,
        updateAccessTokenRepositorySpy
      ),
      new AuthUseCase(
        loadUserRepositorySpy,
        makeEncrypterSpyWithThrow(),
        tokenGeneratorSpy,
        updateAccessTokenRepositorySpy
      ),
      new AuthUseCase(
        loadUserRepositorySpy,
        encrypterSpy,
        makeTokenGeneratorSpyWithThrow(),
        updateAccessTokenRepositorySpy),
      new AuthUseCase(
        loadUserRepositorySpy,
        encrypterSpy,
        tokenGeneratorSpy,
        makeUpdateAccessTokenRepositorySpyWithThrow()
      )
    )

    for (const sut of suts) {
      const promise = sut.auth('any@email.com', 'any_password')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expect(promise).rejects.toThrow()
    }
  })

  it('should throw if any dependency is not provided', function () {
    const loadUserRepositorySpy = makeLoadUserRepositorySpy()
    const encrypterSpy = makeEncrypterSpy()
    const tokenGeneratorSpy = makeTokenGeneratorSpy()
    const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()
    const invalid = null

    const suts = new Array<AuthUseCase>().concat(
      new AuthUseCase(
        invalid as unknown as ILoadUserRepository,
        encrypterSpy,
        tokenGeneratorSpy,
        updateAccessTokenRepositorySpy
      ),
      new AuthUseCase(
        loadUserRepositorySpy,
        invalid as unknown as IEncrypter,
        tokenGeneratorSpy,
        updateAccessTokenRepositorySpy
      ),
      new AuthUseCase(
        loadUserRepositorySpy,
        encrypterSpy,
        invalid as unknown as ITokenGenerator,
        updateAccessTokenRepositorySpy),
      new AuthUseCase(
        loadUserRepositorySpy,
        encrypterSpy,
        tokenGeneratorSpy,
        invalid as unknown as IUpdateAccessTokenRepository
      )
    )

    for (const sut of suts) {
      const promise = sut.auth('any@email.com', 'any_password')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expect(promise).rejects.toThrow()
    }
  })
})
