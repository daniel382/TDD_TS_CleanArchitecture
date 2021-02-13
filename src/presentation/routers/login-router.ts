import HttpResponse from '@/presentation/helpers/http-response'

interface AuthUseCase {
  auth: (email: string, password: string) => void
}

class LoginRouter {
  constructor (private readonly authUseCase: AuthUseCase) {}

  route (httpRequest: any): any {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) { return HttpResponse.badRequest('email') }
    if (!password) { return HttpResponse.badRequest('password') }

    this.authUseCase.auth(email, password)
  }
}

export default LoginRouter
