interface ClubProfilePayload {
    clubName: string;
    activityType: string;
    clubAddress: string;
    aboutClub: string;
    clubPhoneNumber: string;
    foundationDate: string;
    goal: string;
    socialNetworks?: Record<string, any>;
}

export const clubProfileService = (data: ClubProfilePayload) => {
    return FetchApi('/club-profile/complete-profile-club', {
        method: "POST",
        body: data
    })
}