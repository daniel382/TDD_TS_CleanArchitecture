import { MissingParamError } from '../errors'

class TokenGenerator {
  secret: string = ''

  constructor (
    private readonly signer: ISigner,
    secret: string
  ) {
    this.secret = secret
  }

  async generateToken (data: string): Promise<string> {
    if (!this.secret) { throw new MissingParamError('secret') }
    if (!data) { throw new MissingParamError('data') }

    const token = await this.signer.sign(data, this.secret)
    return token
  }
}

interface ISigner {
  sign: (data: string, secret: string) => Promise<string>
}

export default TokenGenerator
