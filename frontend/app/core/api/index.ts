import axios, { AxiosHeaders } from "axios";
import { getTokens } from "../../../utils/secure-store";

const PUBLIC_ROUTES = ['auth/login', 'auth/register']

const axiosClient = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}`,
    headers: {
        'Content-Type': "application/json"
    }
})

axiosClient.interceptors.request.use(async (config) => {
    if (PUBLIC_ROUTES.includes(config.url as string)) {
        return config
    }
    const tokens = await getTokens();
    if (tokens && tokens.token) {
        config.headers = AxiosHeaders.from({
            ...config.headers,
            'Authorization': `Bearer ${tokens.token}`
        })
    }
    return config
})

export default axiosClient