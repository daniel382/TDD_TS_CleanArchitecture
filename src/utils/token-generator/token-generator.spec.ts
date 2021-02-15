class TokenGenerator {
  async generateToken (userId: string): Promise<string> {
    return null as unknown as string
  }
}

function makeSut (): any {
  const sut = new TokenGenerator()

  return { sut }
}

describe('Token Generator', function () {
  it('should return null if JWT returns null', async function () {
    const { sut } = makeSut()
    const token = await sut.generateToken('any_id')
    expect(token).toBe(null)
  })
})
