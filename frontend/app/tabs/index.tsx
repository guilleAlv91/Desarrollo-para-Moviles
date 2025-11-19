import React, { useContext } from "react";
import styled from 'styled-components/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TAB_ROUTES } from '../../utils/constants';
import { AuthContext, AUTH_ACTIONS } from '../../shared/context/AuthContext';
import { colors, materialColors } from '../../utils/colors';
import { Inicio, Perfil } from './screens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Divider from "../../components/Divider";

const Tab = createBottomTabNavigator();

const popupCustomStyles = {
    optionsContainer: {
        backgroundColor: materialColors.schemes.light.surfaceContainer,
        borderRadius: 8,
        marginTop: 50,
        width: 200,
    },
};

const triggerStyles = {
    paddingHorizontal: 15,
};

export default function TabsScreen() {
    const { dispatch, state } = useContext(AuthContext);
    const { user } = state;

    const handleLogout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    return (
        <Tab.Navigator
            screenOptions={({ navigation }) => ({
                headerTitleStyle: { color: colors.primary },
                headerStyle: { backgroundColor: materialColors.schemes.light.surfaceContainer },
                tabBarStyle: { backgroundColor: materialColors.schemes.light.surfaceContainer },
                tabBarActiveTintColor: colors.primary,
                headerRight: () => (
                    <Menu>
                        <MenuTrigger style={triggerStyles}>
                            <MaterialCommunityIcons
                                name="account-circle"
                                size={40}
                                color={colors.primary}
                            />
                        </MenuTrigger>

                        <MenuOptions customStyles={popupCustomStyles}>
                            <MenuOption disabled={true}>
                                <MenuHeader>
                                    <UserNameText>
                                        {user?.nombre} {user?.apellido}
                                    </UserNameText>
                                    <UserEmailText>{user?.email}</UserEmailText>
                                </MenuHeader>
                            </MenuOption>
                            <Divider />
                            <MenuOption onSelect={() => navigation.navigate(TAB_ROUTES.PERFIL)}>
                                <MenuItemContainer>
                                    <MaterialCommunityIcons name="account" size={20} color="black" />
                                    <MenuText>Ver mi perfil</MenuText>
                                </MenuItemContainer>
                            </MenuOption>
                            <MenuOption onSelect={handleLogout}>
                                <MenuItemContainer>
                                    <MaterialIcons
                                        name="logout"
                                        size={20}
                                        color={materialColors.schemes.light.error}
                                    />
                                    <MenuText isLogout>Cerrar sesión</MenuText>
                                </MenuItemContainer>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                )
            })}
        >
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
                    tabBarButton: () => null,
                    tabBarItemStyle: { width: 0, height: 0, flex: 0, overflow: 'hidden' },
                    // tabBarIcon: ({ color, size }) => (
                    //     <MaterialCommunityIcons name="account" size={size} color={color} />
                    // )
                }}
            />
        </Tab.Navigator>
    );
}

const MenuItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  padding-horizontal: 15px;
`;

const MenuText = styled.Text<{ isLogout?: boolean }>`
  margin-left: 10px;
  font-size: 16px;
  color: ${(props) => props.isLogout ? materialColors.schemes.light.error : 'black'};
`;

const MenuHeader = styled.View`
  align-items: center;
  justify-content: center;
`;

const UserNameText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${materialColors.schemes.light.onSurface};
`;

const UserEmailText = styled.Text`
  font-size: 12px;
  color: gray;
  margin-top: 2px;
`;