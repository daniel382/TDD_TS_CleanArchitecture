import MissingParamError from './missing-param-error'
import ServerError from './server-error'
import UnauthorizedError from './unauthorized-error'

class HttpResponse {
  static success (data: any): any {
    return { statusCode: 200, body: data }
  }

  static badRequest (paramName: string): any {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError (): any {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError (): any {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}

export default HttpResponse
