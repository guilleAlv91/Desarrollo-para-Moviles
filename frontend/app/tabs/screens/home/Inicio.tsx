import React, { useCallback, useContext, useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../../../shared/context/AuthContext';
import { MODAL_ROUTES, TAB_ROUTES } from '../../../../utils/constants';
import axiosClient from '../../../core/api';
import Divider from '../../../../components/Divider';
import { getFormattedDate } from '../../../../utils/date';
import { useFocusEffect } from '@react-navigation/native';

interface UltimoRegistro {
    ingreso: string | null;
    egreso: string | null;
}

export default function Inicio({ navigation }: any) {
    const { state } = useContext(AuthContext);
    const { user, isLoading } = state;
    const hoy = getFormattedDate();

    const [ultimoRegistro, setUltimoRegistro] = useState<UltimoRegistro & { isLoading: boolean }>({
        ingreso: null,
        egreso: null,
        isLoading: true,
    });

    const fetchUltimoRegistro = useCallback(async () => {
        if (!user || isLoading) return;
        setUltimoRegistro(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await axiosClient.get(`/asistencias/hoy`);
            const { data } = response;
            const asistenciaActual = data.asistencia || {};

            setUltimoRegistro({
                ingreso: asistenciaActual.horaIngreso || '---',
                egreso: asistenciaActual.horaEgreso || '---',
                isLoading: false,
            });
        } catch (error) {
            console.error("Error al cargar último registro:", error);
            setUltimoRegistro(prev => ({ ...prev, isLoading: false }));
        }
    }, [user, state.token, isLoading]);

    useFocusEffect(
        useCallback(() => {
            fetchUltimoRegistro();
            return () => {};
        }, [fetchUltimoRegistro])
    );

    const handleFichaje = () => {
        navigation.navigate(MODAL_ROUTES.QR_SCANNER);
    };

    if (isLoading) {
        return (
            <LoadingContainer>
                <ActivityIndicator size="small" color="#27B5F4" />
                <Text style={{ marginLeft: 10 }}>Cargando...</Text>
            </LoadingContainer>
        );
    }

    return (
        <Container>
            <HeaderView>
                <EmpresaText>Empresa S.A.</EmpresaText>
                <Text>Hola, {user?.nombre}!</Text>
            </HeaderView>

            <RegistroCard>
                <RegistroTitle>Mi registro de hoy: {hoy}</RegistroTitle>
                <Divider />

                {ultimoRegistro.isLoading ? (
                    <ActivityIndicator size="small" color="#27B5F4" style={{ marginTop: 10, marginBottom: 5 }} />
                ) : (
                    <HorariosRow>
                        <HorarioItem>
                            <HorarioLabel>Ingreso</HorarioLabel>
                            <HorarioValue>
                                {ultimoRegistro.ingreso}
                            </HorarioValue>
                        </HorarioItem>

                        <HorarioItem>
                            <HorarioLabel>Salida</HorarioLabel>
                            <HorarioValue>
                                {ultimoRegistro.egreso}
                            </HorarioValue>
                        </HorarioItem>
                    </HorariosRow>
                )}
            </RegistroCard>

            <SectionsView>
                <RowView>
                    <CardButton onPress={handleFichaje}>
                        <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
                        <CardLabel>Marcar Ingreso/Salida</CardLabel>
                    </CardButton>
                    <CardButton onPress={() => navigation.navigate(TAB_ROUTES.HISTORIAL)}>
                        <MaterialCommunityIcons name="history" size={30} color="black" />
                        <CardLabel>Historial de marcación</CardLabel>
                    </CardButton>
                    <CardButton onPress={() => navigation.navigate(TAB_ROUTES.RECIBOS)}>
                        <MaterialCommunityIcons name="file-document-outline" size={30} color="black" />
                        <CardLabel>Mis recibos</CardLabel>
                    </CardButton>
                </RowView>

                <RowView>
                    <CardButton onPress={() => navigation.navigate(MODAL_ROUTES.MAP)}>
                        <MaterialCommunityIcons name="map-marker-radius" size={30} color="black" />
                        <CardLabel>Ver mapa</CardLabel>
                    </CardButton>
                </RowView>
            </SectionsView>
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #ffffff;
`;

const HeaderView = styled.View`
    align-items: center;
    padding-vertical: 20px;
`;

const EmpresaText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: black;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const SectionsView = styled.View`
    padding-horizontal: 15px;
`;

const RowView = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-vertical: 10px;
`;

const CardButton = styled.TouchableOpacity`
    background-color: #f2f2f2;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
`;

const CardLabel = styled.Text`
    margin-top: 5px;
    font-size: 14px;
    text-align: center;
`;

const RegistroCard = styled.View`
    background-color: #f9f9f9;
    margin-horizontal: 15px;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    elevation: 2;
`;

const RegistroTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    text-align: center;
`;

const HorariosRow = styled.View`
    flex-direction: row;
    justify-content: space-around;
`;

const HorarioItem = styled.View`
    align-items: center;
`;

const HorarioLabel = styled.Text`
    font-size: 12px;
    color: #555;
    margin-bottom: 4px;
`;

const HorarioValue = styled.Text`
    font-size: 20px;
    font-weight: 900;
    color: black;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    flex-direction: row;
`;
