class LoginBodyValidator {
  constructor (private readonly validator: Validator) {}

  validateEmail (email: string): boolean {
    return this.validator.isEmail(email)
  }
}

interface Validator {
  isEmail: (email: string) => boolean
}

export default LoginBodyValidator
