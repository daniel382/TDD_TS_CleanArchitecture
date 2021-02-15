class LoginBodyValidator {
  constructor (private readonly validator: IValidator) {}

  validateEmail (email: string): boolean {
    return this.validator.isEmail(email)
  }
}

interface IValidator {
  isEmail: (email: string) => boolean
}

export default LoginBodyValidator
