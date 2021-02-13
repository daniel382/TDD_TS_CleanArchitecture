import MissingParamError from './missing-param-error'
import UnauthorizedError from './unauthorized-error'

class HttpResponse {
  static success (): any {
    return { statusCode: 200 }
  }

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
