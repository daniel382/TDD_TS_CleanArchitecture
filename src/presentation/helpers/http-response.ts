import { ServerError, UnauthorizedError } from '../errors'

class HttpResponse {
  static success (data: any): any {
    return { statusCode: 200, body: data }
  }

  static badRequest (error: Error): any {
    return {
      statusCode: 400,
      body: error
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
