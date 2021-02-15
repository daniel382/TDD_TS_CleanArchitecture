interface ITokenGenerator {
  generateToken: (userId: string) => Promise<string>
}

export default ITokenGenerator
