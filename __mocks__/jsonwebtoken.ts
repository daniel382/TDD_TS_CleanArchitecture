class JsonWebToken {
  token: string = 'any_token'
  data: string = ''
  secret: string = ''

  sign (data: string, secret: string): any {
    return this.token
  }
}

export default new JsonWebToken()
