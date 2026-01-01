import type { AuthData } from '~/models/auth/AuthData'

export const requestOtpService = (phoneNumber: string) => {
  return FetchApi('/auth/send-otp', {
    method: 'POST',
    body: {
      phoneNumber,
    },
  })
}

export const otpCodeService = (phoneNumber: string, code: string) => {
  return FetchApi<AuthData>('/auth/verify-otp', {
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
  return FetchApi<AuthData>('/auth/registration', {
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
