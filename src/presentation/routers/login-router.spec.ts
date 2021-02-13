class LoginRouter {
  route (httpRequest: any): any {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) { return HttpResponse.badRequest('email') }
    if (!password) { return HttpResponse.badRequest('password') }
  }
}

class HttpResponse {
  static badRequest (paramName: string): any {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError (): any {
    return { statusCode: 500 }
  }
}

class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing parameter: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

function makeSut (): LoginRouter {
  return new LoginRouter()
}

describe('Login Router', function () {
  it('should return 500 if no httpRequest is provided', function () {
    const sut = makeSut()
    const httpResponse = sut.route(null)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if httpRequest has no body', function () {
    const sut = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 400 if no email is provided', function () {
    const sut = makeSut()
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
    const sut = makeSut()
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
