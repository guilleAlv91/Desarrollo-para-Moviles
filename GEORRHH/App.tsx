import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/auth/Login';
import Register from './app/auth/Register';
import Inicio from './app/home/Inicio';
import Perfil from './app/home/Perfil';

const Stack = createStackNavigator()
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="login">
                <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="home" component={Inicio} options={{ headerShown: false }} />
                <Stack.Screen name="perfil" component={Perfil} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
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