export const requestOtpService = (phoneNumber: string) => {
  return FetchApi('/auth/send-otp', {
    method: 'POST',
    body: {
      phoneNumber,
    },
  })
}

export const otpCodeService = (phoneNumber: string, code: string) => {
  return FetchApi<string>('/auth/verify-otp', {
    method: 'POST',
    body: {
      phoneNumber,
      code,
    },
  })
}

export const registerUsersService = (
  fullName: string,
  nationalCode: string,
  phoneNumber: string,
  code: string,
  sportId: number
) => {
  return FetchApi<string>('/auth/registration', {
    method: 'POST',
    body: {
      fullName,
      nationalCode,
      phoneNumber,
      code,
      sportId,
    },
  })
}
