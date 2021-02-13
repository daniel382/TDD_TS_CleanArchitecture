class LoginRouter {
  route (httpRequest: any): any {
    const { email } = httpRequest.body

    if (!email) {
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
})
