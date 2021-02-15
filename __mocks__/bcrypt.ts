class Bcrypt {
  isValid: true = true
  data: string = ''
  hasg: string = ''

  async compare (data: string, hash: string): Promise<true> {
    return this.isValid
  }
}

export default new Bcrypt()
