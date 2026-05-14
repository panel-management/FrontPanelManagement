import type { ClubProfileData } from '~/models/clubProfile/ClubProfileData'

export const getClubProfileService = () => {
  return FetchApi<ClubProfileData>('/club-profile/view-club-profile')
}

export const createClubProfileService = (data: ClubProfileData) => {
  return FetchApi('/club-profile/complete-profile-club', {
    method: 'POST',
    body: data,
  })
}

export const updateClubProfileService = (data: ClubProfileData) => {
  return FetchApi('/club-profile/update-profile-club', {
    method: 'POST',
    body: data,
  })
}
