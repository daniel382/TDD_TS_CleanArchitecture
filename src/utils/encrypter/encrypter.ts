class Encrypter {
  constructor (private readonly encryptor: IEncryptor) {}

  async compare (data: string, hashedValue: string): Promise<boolean> {
    const result = await this.encryptor.compare(data, hashedValue)
    return result
  }
}

interface IEncryptor {
  compare: (data: string, hash: string) => Promise<boolean>
}

export default Encrypter
