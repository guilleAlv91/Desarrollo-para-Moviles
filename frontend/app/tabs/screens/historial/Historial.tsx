import React, { useState, useCallback } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import axiosClient from '../../../core/api';
import { getFormattedDate } from '../../../../utils/date';
import InfoCard, { InfoRowData } from '../../../../components/InfoCard';

interface AsistenciaRecord {
    id: string;
    fecha: string;
    horaIngreso: string | null;
    horaEgreso: string | null;
    // observaciones: string | null;
}

const isRecordToday = (dateString: string): boolean => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return dateString === `${year}-${month}-${day}`;
};

const getFormattedTimeDisplay = (time: string | null, recordDate: string): string => {
    if (time) return time;
    return isRecordToday(recordDate) ? 'Pendiente' : '---';
};

const formatBackendDate = (dateString: string): string => {
    try {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return getFormattedDate(date);
    } catch (e) {
        return dateString;
    }
};

export default function Historial() {
    const [historial, setHistorial] = useState<AsistenciaRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchHistorial = async () => {
                try {
                    const response = await axiosClient.get('/asistencias/historial');
                    if (isActive) setHistorial(response.data);
                } catch (error) {
                    console.error("Error al cargar historial:", error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };
            fetchHistorial();
            return () => { isActive = false; };
        }, [])
    );

    const renderItem = ({ item }: { item: AsistenciaRecord }) => {
        const ingresoVal = getFormattedTimeDisplay(item.horaIngreso, item.fecha);
        const egresoVal = getFormattedTimeDisplay(item.horaEgreso, item.fecha);

        const rows: InfoRowData[] = [
            {
                label: 'Ingreso:',
                value: ingresoVal,
                isHighlighted: ingresoVal === 'Pendiente'
            },
            {
                label: 'Salida:',
                value: egresoVal,
                isHighlighted: egresoVal === 'Pendiente'
            }
        ];

        return (
            <InfoCard
                title={formatBackendDate(item.fecha)}
                rows={rows}
            />
        );
    };

    if (loading) {
        return (
            <LoadingView>
                <ActivityIndicator size="large" color="#27B5F4" />
                <EmptyText>Cargando historial...</EmptyText>
            </LoadingView>
        );
    }

    return (
        <Container>
            {historial.length === 0 ? (
                <EmptyText>No hay registros de asistencia en el historial.</EmptyText>
            ) : (
                <FlatList
                    data={historial}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 10 }}
                />
            )}
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #ffffff;
    padding-horizontal: 15px;
`;

const LoadingView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const EmptyText = styled.Text`
    text-align: center;
    margin-top: 30px;
    font-size: 16px;
    color: #888;
`;