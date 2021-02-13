import HttpResponse from '../helpers/http-response'
import { InvalidParamError, MissingParamError } from '@/utils/errors'
import LoginBodyValidator from '@/utils/login-body-validator'
import IAuthUseCase from '@/domain/usecases/auth-usecase-interface'

class LoginRouter {
  constructor (
    private readonly authUseCase: IAuthUseCase,
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
