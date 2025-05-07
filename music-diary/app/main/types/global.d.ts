interface Window {
    handleRedirect?: () => void
    requestAuthorization?: () => void
    refreshAccessToken?: () => void
    callAuthorizationApi?: (body: string) => void
  }
  