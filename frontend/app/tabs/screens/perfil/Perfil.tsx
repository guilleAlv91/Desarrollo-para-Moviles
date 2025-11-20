import React, { useContext, useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AuthContext, AUTH_ACTIONS } from "../../../../shared/context/AuthContext";
import axiosClient from "../../../core/api";
import { colors } from "../../../../utils";
import { setUser } from "../../../../utils/secure-store";

const CLOUD_NAME = "dcrge0hwj";
const UPLOAD_PRESET = "empleados_preset";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function InformacionPersonal({ navigation }: any) {
    const { dispatch, state } = useContext(AuthContext);
    const { user } = state;

    const [isEditingData, setIsEditingData] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
    });

    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                telefono: user.telefono || '',
            });
            if (user.fotoPerfil) {
                setProfileImage(user.fotoPerfil);
            }
        }
    }, [user]);

    const handleEditAvatar = async () => {
        Alert.alert(
            "Foto de Perfil",
            "Selecciona una opción",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cámara", onPress: openCamera },
                { text: "Galería", onPress: openGallery },
            ]
        );
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadImageToCloudinary(result.assets[0].uri);
        }
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadImageToCloudinary(result.assets[0].uri);
        }
    };

    const uploadImageToCloudinary = async (localUri: string) => {
        setIsUploading(true);
        try {
            const uploadResult = await FileSystem.uploadAsync(CLOUDINARY_URL, localUri, {
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'file',
                parameters: {
                    upload_preset: UPLOAD_PRESET,
                },
            });

            if (uploadResult.status !== 200) {
                console.error("Error Cloudinary:", uploadResult.body);
                throw new Error("Falló la carga de la imagen");
            }

            const data = JSON.parse(uploadResult.body);
            const secureUrl = data.secure_url;

            console.log("Imagen subida exitosamente:", secureUrl);

            await axiosClient.patch('/empleados/me/foto', {
                fotoUrl: secureUrl
            });

            setProfileImage(secureUrl);

            const updatedUser = { ...user, fotoPerfil: secureUrl };

            dispatch({
                type: AUTH_ACTIONS.LOGIN,
                payload: {
                    user: updatedUser,
                    token: state.token,
                    refreshToken: state.refreshToken
                }
            });

            Alert.alert("Éxito", "Foto de perfil actualizada correctamente");

        } catch (error) {
            console.error("Error en el proceso de foto:", error);
            Alert.alert("Error", "No se pudo actualizar la foto de perfil. Intenta nuevamente.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveData = async () => {
        if (!formData.nombre.trim() || !formData.apellido.trim()) {
            Alert.alert("Error", "Nombre y Apellido son obligatorios");
            return;
        }
        try {
            const response = await axiosClient.patch(`/empleados/me`, formData);
            const updatedUser = response.data;
            await setUser(updatedUser);
            dispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: { user: updatedUser }
            });
            dispatch({
                type: AUTH_ACTIONS.LOGIN,
                payload: {
                    user: updatedUser,
                    token: state.token,
                    refreshToken: state.refreshToken
                }
            });
            Alert.alert("Éxito", "Información actualizada");
            setIsEditingData(false);
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", "No se pudo actualizar.");
        }
    };

    return (
        <Container>
            <Header>
                <HeaderTitle>Información personal</HeaderTitle>
            </Header>

            <ProfileSection>
                <AvatarContainer>
                    {isUploading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            {profileImage ? (
                                <ProfileImage source={{ uri: profileImage }} />
                            ) : (
                                <MaterialCommunityIcons name="account" size={70} color="#bbb" />
                            )}
                        </>
                    )}

                    <AvatarEditButton onPress={handleEditAvatar} disabled={isUploading}>
                        <MaterialCommunityIcons name="camera" size={16} color="white" />
                    </AvatarEditButton>
                </AvatarContainer>
            </ProfileSection>

            <ListContainer>
                <ListItem disabled={true}>
                    <MaterialCommunityIcons name="email-outline" size={24} color={colors.primary} />
                    <ItemContent>
                        <LabelText>Usuario</LabelText>
                        <ValueText style={{ textTransform: 'lowercase', color: '#888' }}>
                            {user?.email}
                        </ValueText>
                    </ItemContent>
                </ListItem>

                <Separator />

                <ListItem disabled={!isEditingData}>
                    <MaterialCommunityIcons name="account-outline" size={24} color='#27B5F4' />
                    <ItemContent>
                        <LabelText>Nombre</LabelText>
                        {isEditingData ? (
                            <StyledInput
                                value={formData.nombre}
                                onChangeText={(t) => handleChange('nombre', t)}
                            />
                        ) : (
                            <ValueText>{formData.nombre}</ValueText>
                        )}
                    </ItemContent>
                </ListItem>

                <Separator />

                <ListItem disabled={!isEditingData}>
                    <MaterialCommunityIcons name="account-outline" size={24} color='#27B5F4' />
                    <ItemContent>
                        <LabelText>Apellido</LabelText>
                        {isEditingData ? (
                            <StyledInput
                                value={formData.apellido}
                                onChangeText={(t) => handleChange('apellido', t)}
                            />
                        ) : (
                            <ValueText>{formData.apellido}</ValueText>
                        )}
                    </ItemContent>
                </ListItem>

                <Separator />

                <ListItem disabled={!isEditingData}>
                    <MaterialCommunityIcons name="cellphone" size={24} color='#27B5F4' />
                    <ItemContent>
                        <LabelText>Teléfono</LabelText>
                        {isEditingData ? (
                            <StyledInput
                                value={formData.telefono}
                                onChangeText={(t) => handleChange('telefono', t)}
                            />
                        ) : (
                            <ValueText>{formData.telefono || 'Agregar'}</ValueText>
                        )}
                    </ItemContent>
                </ListItem>

            </ListContainer>

            <FloatingActionButton
                onPress={() => isEditingData ? handleSaveData() : setIsEditingData(true)}
                isEditing={isEditingData}
            >
                <MaterialCommunityIcons
                    name={isEditingData ? "content-save" : "pencil"}
                    size={24}
                    color="white"
                />
            </FloatingActionButton>

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
    position: relative; 
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    border-width: 1px;
    border-color: #ccc;
    background-color: #f0f0f0;
    overflow: hidden;
`;

const ProfileImage = styled.Image`
    width: 100px;
    height: 100px;
`;

const AvatarEditButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 5px; 
    right: 10px;
    background-color: #27B5F4;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    border-width: 2px;
    border-color: white;
    elevation: 4;
    z-index: 10;
`;

const FloatingActionButton = styled.TouchableOpacity<{ isEditing: boolean }>`
    position: absolute;
    bottom: 30px;
    right: 30px;
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background-color: ${props => props.isEditing ? '#4CD964' : '#27B5F4'};
    justify-content: center;
    align-items: center;
    elevation: 6;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.3;
    shadow-radius: 3px;
`;

const ListContainer = styled.View`
    margin-horizontal: 20px;
`;
const ListItem = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding-vertical: 15px;
`;
const ItemContent = styled.View`
        margin-left: 15px;
        flex: 1;
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
    border-bottom-color: #27B5F4;
    padding-vertical: 2px;
    width: 100%;
`;
const Separator = styled.View`
    height: 1px;
    background-color: #eee;
`;