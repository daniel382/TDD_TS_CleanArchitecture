import jwt from '../../../__mocks__/jsonwebtoken'
import { MissingParamError } from '../errors'

class TokenGenerator {
  secret: string = ''

  constructor (secret: string) {
    this.secret = secret
  }

  async generateToken (data: string): Promise<string> {
    if (!this.secret) { throw new MissingParamError('secret') }
    if (!data) { throw new MissingParamError('data') }

    const token = await jwt.sign(data, this.secret)
    return token
  }
}

function makeSut (): any {
  const sut = new TokenGenerator('secret')

  return { sut }
}

describe('Token Generator', function () {
  it('should return a token if JWT returns a token', async function () {
    const { sut } = makeSut()

    const token = await sut.generateToken('any_id')
    expect(token).toBe(jwt.token)
  })

  it('should return null if JWT returns null', async function () {
    const { sut } = makeSut()

    jwt.token = null as unknown as string
    const token = await sut.generateToken('any_id')
    expect(token).toBe(null)
  })

  it('should call JWT with correct values', function () {
    const { sut } = makeSut()

    jwt.token = null as unknown as string
    sut.generateToken('any_id')
    expect(jwt.data).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  it('should throw if no secret is provided', function () {
    const sut = new TokenGenerator(null as unknown as string)

    const promise = sut.generateToken('any_id')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  it('should throw if no data is provided', function () {
    const { sut } = makeSut()

    const promise = sut.generateToken()
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new MissingParamError('data'))
  })
})
