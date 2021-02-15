import { MissingParamError } from '../errors'

class LoginBodyValidator {
  constructor (private readonly validator: IValidator) {}

  validateEmail (email: string): boolean {
    if (!email) { throw new MissingParamError('email') }

    return this.validator.isEmail(email)
  }
}

interface IValidator {
  isEmail: (email: string) => boolean
}

export default LoginBodyValidator
