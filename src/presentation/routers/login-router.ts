import HttpResponse from '../helpers/http-response'

interface AuthUseCase {
  auth: (email: string, password: string) => string
}

class LoginRouter {
  constructor (private readonly authUseCase: AuthUseCase) {}

  route (httpRequest: any): any {
    if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) { return HttpResponse.badRequest('email') }
    if (!password) { return HttpResponse.badRequest('password') }

    const accessToken = this.authUseCase.auth(email, password)
    if (!accessToken) { return HttpResponse.unauthorizedError() }

    return HttpResponse.success()
  }
}

export default LoginRouter
