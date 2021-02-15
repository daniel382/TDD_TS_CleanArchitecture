class Encrypter {
  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return true
  }
}

function makeSut (): any {
  const sut = new Encrypter()
  return { sut }
}

describe('Encrypter', function () {
  it('should return true if bcrypt returns true', async function () {
    const { sut } = makeSut()
    const result = await sut.compare('any_password', 'any_hashed_password')
    expect(result).toBe(true)
  })
})
