import LoginRouter from '@/presentation/routers/login-router'
import MissingParamError from '@/presentation/helpers/missing-param-error'

class AuthUseCaseSpy {
  email: string = ''
  password: string = ''

  auth (email: string, password: string): void {
    this.email = email
    this.password = password
  }
}

function makeSut (): any {
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)

  return { sut, authUseCase: authUseCaseSpy }
}

describe('Login Router', function () {
  it('should return 500 if no httpRequest is provided', function () {
    const { sut } = makeSut()
    const httpResponse = sut.route(null)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if httpRequest has no body', function () {
    const { sut } = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 400 if no email is provided', function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should call AuthUseCase with correct params', function () {
    const { sut, authUseCase: authUseCaseSpy } = makeSut()
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
})
