class JsonWebToken {
  token: string = 'any_token'
  data: string = ''
  secret: string = ''

  sign (data: string, secret: string): any {
    this.data = data
    this.secret = secret

    return this.token
  }
}

export default new JsonWebToken()
