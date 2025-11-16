import { useReducer } from "react"
import AuthContext from "./auth-context"
import { IUser } from "../../models"
import { AUTH_ACTIONS } from "./enums"
import { deleteUser } from "../../../utils/secure-store"

interface State {
    isLoading: boolean,
    token: string | null,
    user: IUser | null,
    refreshToken: string | null
}

interface Action {
    type: AUTH_ACTIONS
    payload?: any
}

const initialState = {
    isLoading: false,
    token: null,
    user: null,
    refreshToken: null
}
const AuthProvider = (props: any) => {
    const [state, dispatch] = useReducer((prevState: State, action) => {
        const { payload } = action
        switch (action.type) {
            case AUTH_ACTIONS.LOGIN:
                return {
                    ...prevState,
                    user: payload.user,
                    token: payload.token,
                    refreshToken: payload.refreshToken,
                }
            case AUTH_ACTIONS.LOGOUT:
                deleteUser()
                return initialState
            case AUTH_ACTIONS.SET_USER:
                // setUser(payload.user)
                // setTokens({ token: payload.token, refreshToken: payload.refreshToken });
                return {
                    ...prevState,
                    isLoading: false,
                    user: payload.user,
                    token: payload.token,
                    refreshToken: payload.refreshToken,
                };
            default:
                return prevState
        }
    }, initialState)
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider