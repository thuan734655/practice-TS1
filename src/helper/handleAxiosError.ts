import { AxiosError } from "axios";
import type { IApiResponse } from "@/types/apiResponseTypes";

function handleAxiosError<T>(error: unknown, defaultMessage: string, defaultData: T): IApiResponse<T> {
    if (error instanceof AxiosError && error.response) {
        return {
            success: false,
            message: error.response.data?.message || defaultMessage,
            data: defaultData,
        };
    }
    return {
        success: false,
        message: defaultMessage,
        data: defaultData,
    };
}

export default handleAxiosError;
