class LoginBodyValidator {
  validateEmail (email: string): boolean {
    return true
  }
}

function makeSut (): any {
  const sut = new LoginBodyValidator()
  return { sut }
}

describe('Login Body Validator', function () {
  it('should return true if validator returns true', function () {
    const { sut } = makeSut()
    const isEmailValid = sut.validateEmail('valid@email.com')
    expect(isEmailValid).toBe(true)
  })
})
