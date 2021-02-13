import LoginBodyValidator from '.'
import validator from '../../../__mocks__/validator'

function makeSut (): any {
  const sut = new LoginBodyValidator(validator)
  return { sut, validator }
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

  it('should class validator if correct email', function () {
    const { sut, validator } = makeSut()

    sut.validateEmail('any@email.com')
    expect(validator.email).toBe('any@email.com')
  })
})
