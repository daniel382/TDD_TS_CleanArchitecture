interface ILoadUserRepository {
  load: (email: string) => Promise<any>
}

export default ILoadUserRepository
