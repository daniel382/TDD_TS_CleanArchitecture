import jwt from '../../../__mocks__/jsonwebtoken'

class TokenGenerator {
  async generateToken (data: string): Promise<string> {
    const token = await jwt.sign(data, 'secret')
    return token
  }
}

function makeSut (): any {
  const sut = new TokenGenerator()

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
})
