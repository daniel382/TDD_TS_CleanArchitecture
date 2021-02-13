interface IAuthUseCase {
  auth: (email: string, password: string) => string
}

export default IAuthUseCase
