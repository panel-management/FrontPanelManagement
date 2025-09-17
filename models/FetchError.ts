import type {ApiResponse} from "~/models/ApiResponse";

export interface FetchError {
    response: {
        status: number,
        _data: any | ApiResponse<undefined> | undefined,
        ok: boolean
    }
}