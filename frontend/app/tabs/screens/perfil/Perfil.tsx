import React, { useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../../shared/context/AuthContext";
import { AUTH_ACTIONS } from "../../../../shared/context/AuthContext";
import axiosClient from "../../../core/api";

export default function InformacionPersonal({ navigation }: any) {
    const { dispatch, state } = useContext(AuthContext);
    const { user } = state;

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                telefono: user.telefono || '',
            });
        }
    }, [user]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!formData.nombre.trim() || !formData.apellido.trim()) {
            Alert.alert("Error", "Nombre y Apellido son obligatorios");
            return;
        }

        try {
            const payload = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                telefono: formData.telefono,
            };
            const response = await axiosClient.patch(`/empleados/me`, payload);
            const updatedUser = response.data;
            dispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: {
                    user: updatedUser,
                    token: state.token,
                    refreshToken: state.refreshToken
                }
            });

            Alert.alert("¡Listo!", "Se actualizó tu información");
            setIsEditing(false);
        } catch (error: any) {
            console.error("Error al actualizar:", error);
            const mensaje = error.response?.data?.message || "Error al guardar la información.";
            Alert.alert("Error", mensaje);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    return (
        <Container>
            <Header>
                <HeaderTitle>Información personal</HeaderTitle>
            </Header>

            <ProfileSection>
                <AvatarContainer>
                    <MaterialCommunityIcons name="account" size={70} color="#bbb" />
                </AvatarContainer>
                <EditButton onPress={toggleEdit} isEditing={isEditing}>
                    <MaterialCommunityIcons
                        name={isEditing ? "check" : "pencil"}
                        size={20}
                        color="white"
                    />
                </EditButton>
            </ProfileSection>

            <ListContainer>
                <ListItem disabled={true}>
                    <MaterialCommunityIcons name="email-outline" size={24} color='#27B5F4' />
                    <ItemContent>
                        <LabelText>Usuario (Correo electrónico)</LabelText>
                        <ValueText style={{ textTransform: 'lowercase', color: '#888' }}>
                            {user?.email}
                        </ValueText>
                    </ItemContent>
                </ListItem>

                <Separator />

                <ListItem disabled={!isEditing}>
                    <MaterialCommunityIcons name="account-outline" size={24} color='#27B5F4' />
                    <ItemContent>
                        <LabelText>Nombre</LabelText>
                        {isEditing ? (
                            <StyledInput
                                value={formData.nombre}
                                onChangeText={(text) => handleChange('nombre', text)}
                            />
                        ) : (
                            <ValueText>{formData.nombre}</ValueText>
                        )}
                    </ItemContent>
                </ListItem>

                <Separator />

                <ListItem disabled={!isEditing}>
                    <MaterialCommunityIcons name="account-outline" size={24} color='#27B5F4' />
                    <ItemContent>
                        <LabelText>Apellido</LabelText>
                        {isEditing ? (
                            <StyledInput
                                value={formData.apellido}
                                onChangeText={(text) => handleChange('apellido', text)}
                            />
                        ) : (
                            <ValueText>{formData.apellido}</ValueText>
                        )}
                    </ItemContent>
                </ListItem>

                <Separator />

                <ListItem disabled={!isEditing}>
                    <MaterialCommunityIcons name="cellphone" size={24} color='#27B5F4' />
                    <ItemContent>
                        <LabelText>Teléfono</LabelText>
                        {isEditing ? (
                            <StyledInput
                                value={formData.telefono}
                                onChangeText={(text) => handleChange('telefono', text)}
                                keyboardType="phone-pad"
                                placeholder="Agregar número"
                            />
                        ) : (
                            <ValueText
                                style={{
                                    color: user?.telefono ? 'black' : '#9CA3AF',
                                    fontWeight: user?.telefono ? 'bold' : 'normal'
                                }}
                            >
                                {user?.telefono || 'Agregar número de contacto'}
                            </ValueText>
                        )}
                    </ItemContent>
                </ListItem>

            </ListContainer>
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #fff;
`;

const Header = styled.View`
    padding-top: 50px;
    padding-bottom: 20px;
    align-items: center;
`;

const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: black;
`;

const ProfileSection = styled.View`
    align-items: center;
    margin-vertical: 20px;
`;

const AvatarContainer = styled.View`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border-width: 1px;
    border-color: #ccc;
    justify-content: center;
    align-items: center;
`;

const EditButton = styled.TouchableOpacity<{ isEditing: boolean }>`
    position: absolute;
    bottom: 0;
    right: 35%; 
    background-color: ${props => props.isEditing ? '#4CD964' : '#27B5F4'}; /* Verde o Azul */
    border-radius: 20px;
    padding: 8px;
`;

const ListContainer = styled.View`
    margin-horizontal: 20px;
`;

const itemStyles = `
    flex-direction: row;
    align-items: center;
    padding-vertical: 15px;
`;

const ListItem = styled.TouchableOpacity`
    ${itemStyles}
`;

const ItemContent = styled.View`
    margin-left: 15px;
    flex: 1; /* Importante para que el Input ocupe todo el ancho disponible */
`;

const LabelText = styled.Text`
    font-size: 14px;
    color: #555;
    margin-bottom: 4px;
`;

const ValueText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: black;
    text-transform: capitalize;
`;

const StyledInput = styled.TextInput`
    font-size: 16px;
    font-weight: bold;
    color: #000;
    border-bottom-width: 1px;
    border-bottom-color: #27B5F4; /* Línea azul para indicar foco/edición */
    padding-vertical: 2px;
    width: 100%;
`;

const Separator = styled.View`
    height: 1px;
    background-color: #eee;
`;