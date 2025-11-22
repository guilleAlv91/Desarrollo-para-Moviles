import { View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { MODAL_ROUTES, ROOT_ROUTES } from '../utils/constants'
import { useState } from 'react'
import AuthContext from '../shared/context/AuthContext/auth-context'
import TabsScreen from './tabs'
import AuthStackScreen from './auth'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getTokens, getUser } from '../utils/secure-store'
import { AUTH_ACTIONS } from '../shared/context/AuthContext'
import * as SplashScreen from 'expo-splash-screen'
import { QRScanner } from './tabs/screens'
import MapScreen from "./tabs/screens/map/MapScreen";

const Stack = createNativeStackNavigator()

export default function Root() {
    const { state, dispatch } = useContext(AuthContext)
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false)

    useEffect(() => {
        if (state?.user) {
            setIsSignedIn(true)
        }
        else {
            setIsSignedIn(false)
        }
        console.log('st', state)
    }, [state]);

    // useEffect(() => {
    //     getUser().then(user => {
    //         if (user) {
    //             dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user } })
    //             setIsSignedIn(true)
    //             // SplashScreen.hideAsync()
    //         }
    //     })
    // }, [])

    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const [tokens, user] = await Promise.all([
                    getTokens(),
                    getUser()
                ]);

                if (tokens && user) {
                    dispatch({
                        type: AUTH_ACTIONS.SET_USER,
                        payload: {
                            user: user,
                            token: tokens.token,
                            refreshToken: tokens.refreshToken
                        }
                    });
                } else {
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } catch (e) {
                console.error("Error restaurando sesión:", e);
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
        };
        bootstrapAsync();
    }, [dispatch]);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator initialRouteName={isSignedIn ? ROOT_ROUTES.TABS : ROOT_ROUTES.AUTH} screenOptions={{ headerShown: false }}>
                {
                    isSignedIn ?
                        <Stack.Screen name={ROOT_ROUTES.TABS} component={TabsScreen} />
                        :
                        <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthStackScreen} />
                }
                <Stack.Group screenOptions={{ presentation: "modal" }}>
                    <Stack.Screen name={MODAL_ROUTES.QR_SCANNER} component={QRScanner} />
                    <Stack.Screen name={MODAL_ROUTES.MAP} component={MapScreen} />
                </Stack.Group>

            </Stack.Navigator>
        </View>
    )
}