import type { FetchConfig } from '~/models/config/fetchConfig'
import type { ApiResponse } from '~/models/ApiResponse'
import type { FetchError } from '~/models/FetchError'

export function FetchApi<TData>(
  url: string,
  config: FetchConfig | undefined = {}
): Promise<ApiResponse<TData>> {
  const runTime = useRuntimeConfig()
  const toastStore = useToastStore()
  const accountStore = useAccountStore()
  const newConfig: FetchConfig = {
    baseURL: `${runTime.public.API_URL}/api/v1`,
    ...config,
    retry: 0,
  }
  if (accountStore.isLogin) {
    if (!newConfig.headers) {
      newConfig.headers = {}
    }
    //@ts-ignore
    newConfig.headers['authorization'] = `Bearer ${accountStore.getToken!}`
  }
  const showError = (data: ApiResponse<any>) => {
    if (process.client) {
      if (data.statusCode === 404) {
        toastStore.setAlert(data.message, '', 'warning', 'material-symbols-light:warning-rounded')
      } else {
        toastStore.setAlert(data.message, '', 'error', 'bx:bxs-error')
      }
    }
  }
  //@ts-ignore
  return $fetch<ApiResponse<TData>>(url, newConfig)
    .then((response) => {
      return response
    })
    .catch((e: FetchError) => {
      let CustomResponse = {
        data: undefined,
        statusCode: e.response._data?.statusCode ?? 500,
        message: e.response._data?.message ?? 'خطای سمت سرور',
      } as ApiResponse<undefined>
      switch (e.response.status) {
        case 400: {
          CustomResponse.statusCode = 400
          let msg = e.response._data?.message ?? 'اطلاعات نامتعبر است'
          CustomResponse.message = Array.isArray(msg) ? msg.join('') : String(msg)
          break
        }
        case 401: {
          CustomResponse.statusCode = 401
          let msg = e.response._data?.message ?? 'دسترسی غیر مجاز'
          CustomResponse.message = Array.isArray(msg) ? msg.join('') : String(msg)
          break
        }
        case 403: {
          CustomResponse.statusCode = 403
          let msg = e.response._data?.message ?? 'دسترسی به منبع درخواست شده ممنوع است'
          CustomResponse.message = Array.isArray(msg) ? msg.join('') : String(msg)
          break
        }
        case 404: {
          CustomResponse.statusCode = 404
          let msg = e.response._data?.message ?? 'اطلاعات یافت نشد'
          CustomResponse.message = Array.isArray(msg) ? msg.join('') : String(msg)
          break
        }
        case 406: {
          CustomResponse.statusCode = 406
          let msg = e.response._data?.message ?? 'درخواست قابل قبول نیست'
          CustomResponse.message = Array.isArray(msg) ? msg.join('') : String(msg)
          break
        }
      }
      showError(CustomResponse)
      return CustomResponse
    })
}
