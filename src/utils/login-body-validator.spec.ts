import validator from '../../__mocks__/validator'

class LoginBodyValidator {
  constructor (private readonly validator: any) {}

  validateEmail (email: string): boolean {
    return this.validator.isEmail(email)
  }
}

function makeSut (): any {
  const sut = new LoginBodyValidator(validator)
  return { sut }
}

describe('Login Body Validator', function () {
  it('should return true if validator returns true', function () {
    const { sut } = makeSut()

    const isEmailValid = sut.validateEmail('valid@email.com')
    expect(isEmailValid).toBe(true)
  })

  it('should return false if validator returns false', function () {
    const { sut } = makeSut()

    sut.validator.isValid = false
    const isEmailValid = sut.validateEmail('invalid_email')
    expect(isEmailValid).toBe(false)
  })
})
