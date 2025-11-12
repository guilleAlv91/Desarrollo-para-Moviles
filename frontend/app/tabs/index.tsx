import { Pressable } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TAB_ROUTES } from '../../utils/constants';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useContext } from "react";
import { AuthContext, AUTH_ACTIONS } from '../../shared/context/AuthContext';
import { materialColors } from '../../utils/colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Inicio from '../home/Inicio';
import Perfil from '../perfil/Perfil';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabsScreen() {
    const { dispatch } = useContext(AuthContext)
    const handleLogout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }

    return (
        <Tab.Navigator screenOptions={{
            headerTitleStyle: { color: materialColors.schemes.light.onPrimaryContainer },
            headerStyle: { backgroundColor: materialColors.schemes.light.surfaceContainer },
            tabBarStyle: { backgroundColor: materialColors.schemes.light.surfaceContainer },
            tabBarActiveTintColor: materialColors.schemes.light.onPrimaryContainer,
            headerRight: () => (
                <Pressable onPress={handleLogout}>
                    <MaterialIcons name="logout" size={24} color={materialColors.schemes.light.onPrimaryContainer} />
                </Pressable>
            )
        }}>
            {/* AGREGAR TODAS LAS SECCIONES */}
            <Tab.Screen name={TAB_ROUTES.HOME} component={Inicio}
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="home" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen name={TAB_ROUTES.PERFIL} component={Perfil}
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}