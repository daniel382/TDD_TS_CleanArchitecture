import bcrypt from '../../../__mocks__/bcrypt'
import { MissingParamError } from '../errors'
import Encrypter from './encrypter'

function makeSut (): any {
  const sut = new Encrypter(bcrypt)
  return { sut, bcrypt }
}

describe('Encrypter', function () {
  it('should return true if bcrypt returns true', async function () {
    const { sut } = makeSut()
    const result = await sut.compare('any_password', 'any_hashed_password')
    expect(result).toBe(true)
  })

  it('should return false if bcrypt returns false', async function () {
    const { sut, bcrypt } = makeSut()

    bcrypt.isValid = false
    const result = await sut.compare('any_password', 'any_hashed_password')
    expect(result).toBe(false)
  })

  it('should call bcrypt with correct values', async function () {
    const { sut, bcrypt } = makeSut()

    await sut.compare('any_password', 'any_hashed_password')
    expect(bcrypt.data).toBe('any_password')
    expect(bcrypt.hash).toBe('any_hashed_password')
  })

  it('should throw if no data param is provided', function () {
    const { sut } = makeSut()

    const promise = sut.compare(null, 'any_hashed_password')
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow(new MissingParamError('data'))
  })
})
