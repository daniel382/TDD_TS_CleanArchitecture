import { MissingParamError } from '../errors'

class Encrypter {
  constructor (private readonly encryptor: IEncryptor) {}

  async compare (data: string, hash: string): Promise<boolean> {
    if (!data) { throw new MissingParamError('data') }
    if (!hash) { throw new MissingParamError('hash') }

    const result = await this.encryptor.compare(data, hash)
    return result
  }
}

interface IEncryptor {
  compare: (data: string, hash: string) => Promise<boolean>
}

export default Encrypter
