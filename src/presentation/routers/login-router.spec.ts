import LoginRouter from './login-router'
import MissingParamError from '../helpers/missing-param-error'
import ServerError from '../helpers/server-error'
import UnauthorizedError from '../helpers/unauthorized-error'

function makeSut (): any {
  const authUseCaseSpy = makeAuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)

  return { sut, authUseCaseSpy }
}

function makeAuthUseCaseSpy (): any {
  class AuthUseCaseSpy {
    email: string = ''
    password: string = ''
    accessToken: string = ''

    async auth (email: string, password: string): Promise<string> {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  return new AuthUseCaseSpy()
}

function makeAuthUseCaseSpyWithThrowsInAuthMethod (): any {
  class AuthUseCaseSpy {
    async auth (): Promise<void> {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

function makeSutWithInvalidAuthUseCase (authUseCase: any): any {
  const sut = new LoginRouter(authUseCase)

  return { sut }
}

describe('Login Router', function () {
  it('should return 500 if no httpRequest is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.route(null)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 500 if httpRequest has no body', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should call AuthUseCase with correct params', function () {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('should return 401 if invalid credentials are provided', async function () {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        password: 'invalid_password'
      }
    }

    authUseCaseSpy.accessToken = null
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('should return 500 if no AuthUseCase is provided', async function () {
    const { sut } = makeSutWithInvalidAuthUseCase(null)
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 500 if AuthUseCase has no auth method', async function () {
    const { sut } = makeSutWithInvalidAuthUseCase({})
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 200 if valid credentials are provided', async function () {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid@email.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('should return 500 if AuthUseCase.auth throws', async function () {
    const authUseCaseSpy = makeAuthUseCaseSpyWithThrowsInAuthMethod()
    const { sut } = makeSutWithInvalidAuthUseCase(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
