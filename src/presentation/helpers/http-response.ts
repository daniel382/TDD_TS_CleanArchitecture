import MissingParamError from './missing-param-error'
import UnauthorizedError from './unauthorized-error'

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

  static unauthorizedError (): any {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}

export default HttpResponse
