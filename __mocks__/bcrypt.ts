class Bcrypt {
  isValid: true = true
  data: string = ''
  hash: string = ''

  async compare (data: string, hash: string): Promise<true> {
    this.data = data
    this.hash = hash
    return this.isValid
  }
}

export default new Bcrypt()
