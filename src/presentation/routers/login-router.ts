import HttpResponse from '../helpers/http-response'
import { InvalidParamError, MissingParamError } from '../errors'

interface AuthUseCase {
  auth: (email: string, password: string) => string
}

interface LoginBodyValidator {
  validateEmail: (email: string) => boolean
}

class LoginRouter {
  constructor (
    private readonly authUseCase: AuthUseCase,
    private readonly loginBodyValidator: LoginBodyValidator
  ) {}

  async route (httpRequest: any): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!this.loginBodyValidator.validateEmail(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) { return HttpResponse.unauthorizedError() }

      return HttpResponse.success({ accessToken })
      //
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

export default LoginRouter
