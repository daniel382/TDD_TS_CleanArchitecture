import MissingParamError from '@/presentation/helpers/missing-param-error'

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
}

export default HttpResponse
