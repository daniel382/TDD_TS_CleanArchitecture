interface IUpdateAccessTokenRepository {
  updateUserAccessToken: (userId: string, accessToken: string) => Promise<boolean>
}

export default IUpdateAccessTokenRepository
