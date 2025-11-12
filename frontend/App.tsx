import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Root from './app/root';
import AuthProvider from './shared/context/AuthContext/auth-provider';
// import * as SplashScreen from 'expo-splash-screen'

// SplashScreen.preventAutoHideAsync()
// SplashScreen.setOptions({
//     duration: 1000,
//     fade: true,
// })
export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <AuthProvider>
                    <Root />
                </AuthProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});