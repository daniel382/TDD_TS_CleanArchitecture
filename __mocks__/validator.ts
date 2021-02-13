class Validator {
  isValid: boolean = true
  email: string = ''

  isEmail (email: string): any {
    this.email = email
    return this.isValid
  }
}

export default new Validator()
