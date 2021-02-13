class LoginRouter {
  route (httpRequest: any): any {
    const { email, password } = httpRequest.body

    if (!email) {
      return {
        statusCode: 400
      }
    }

    if (!password) {
      return {
        statusCode: 400
      }
    }
  }
}

function makeSut (): LoginRouter {
  return new LoginRouter()
}

describe('Login Router', function () {
  it('should return 400 if no email is provided', function () {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
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
  })
})
