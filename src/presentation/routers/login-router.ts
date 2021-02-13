import HttpResponse from '../helpers/http-response'

interface AuthUseCase {
  auth: (email: string, password: string) => string
}

class LoginRouter {
  constructor (private readonly authUseCase: AuthUseCase) {}

  async route (httpRequest: any): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) { return HttpResponse.badRequest('email') }
      if (!password) { return HttpResponse.badRequest('password') }

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
