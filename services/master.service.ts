export const getAllMasterService = () => {
    return FetchApi('/master')
}

export const changeStatusMasterService = (id: number, active: string) => {
    return FetchApi(`/master/changeStatus/${id}`, {
        method: 'PUT',
        body: {active}
    })
}

export const deleteMasterService = (id: number) => {
    return FetchApi(`master/${id}`, {
        method: 'DELETE'
    })
}