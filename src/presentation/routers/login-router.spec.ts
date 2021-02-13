import LoginRouter from '@/presentation/routers/login-router'
import MissingParamError from '@/presentation/helpers/missing-param-error'

class AuthUseCase {
  auth (): void {

  }
}

function makeSut (): any {
  const authUseCase = new AuthUseCase()
  const sut = new LoginRouter()

  return { sut, authUseCase }
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
})
