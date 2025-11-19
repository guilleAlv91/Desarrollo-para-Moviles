import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../../../shared/context/AuthContext';
import { MODAL_ROUTES } from '../../../../utils/constants';
import axiosClient from '../../../core/api';
import Divider from '../../../../components/Divider';
import { getFormattedDate } from '../../../../utils/date';

interface UltimoRegistro {
    ingreso: string | null;
    egreso: string | null;
}

export default function Inicio({ navigation }: any) {
    const { state } = useContext(AuthContext);
    const { user, isLoading } = state;
    const hoy = getFormattedDate();

    const [ultimoRegistro, setUltimoRegistro] = useState<UltimoRegistro>({
        ingreso: null,
        egreso: null,
    });

    useEffect(() => {
        const fetchUltimoRegistro = async () => {
            if (!user) return;
            try {
                const response = await axiosClient.get(`/asistencias/hoy`);
                const { data } = response
                const asistenciaActual = data.asistencia || {};

                setUltimoRegistro({
                    ingreso: asistenciaActual.horaIngreso || '-',
                    egreso: asistenciaActual.horaEgreso || '-',
                });
            } catch (error) {
                console.error("Error al cargar último registro:", error);
                setUltimoRegistro(prev => ({ ...prev, isLoading: false }));
            }
        };

        fetchUltimoRegistro();
    }, [user, state.token]);

    const handleFichaje = () => {
        navigation.navigate(MODAL_ROUTES.QR_SCANNER);
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text><ActivityIndicator size="small" color="#27B5F4" /> Cargando...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.empresa}>Empresa S.A.</Text>
                <Text>Hola, {user?.nombre}!</Text>
            </View>

            <View style={styles.registroCard}>
                <Text style={styles.registroTitle}>Mi registro de hoy: {hoy}</Text>
                <Divider />
                {/* {ultimoRegistro.isLoading ? (
                    <ActivityIndicator size="small" color="#27B5F4" />
                ) : ( */}
                <View style={styles.registroHorarios}>
                    <View style={styles.horarioItem}>
                        <Text style={styles.horarioLabel}>Ingreso</Text>
                        <Text style={styles.horarioValue}>
                            {ultimoRegistro.ingreso}
                        </Text>
                    </View>
                    <View style={styles.horarioItem}>
                        <Text style={styles.horarioLabel}>Salida</Text>
                        <Text style={styles.horarioValue}>
                            {ultimoRegistro.egreso}
                        </Text>
                    </View>
                </View>
                {/* )} */}
            </View>
            <View style={styles.sections}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.card} onPress={handleFichaje}>
                        <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
                        <Text style={styles.label}>Marcar Ingreso/Salida</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <MaterialCommunityIcons name="history" size={30} color="black" />
                        <Text style={styles.label}>Historial de marcación</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            '#ffffff'
    },
    header: {
        alignItems:
            'center',
        paddingVertical: 20
    },
    empresa: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 30,
        marginBottom: 20
    },
    sections: {
        paddingHorizontal: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    card: {
        backgroundColor: '#f2f2f2',
        width: 100,
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        fontSize: 30
    },
    label: {
        marginTop: 5,
        fontSize: 14,
        textAlign: 'center'
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    },
    bottomItem: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomLabel: {
        fontSize: 12,
        marginTop: 2
    },
    centerButton: {
        backgroundColor: '#27B5F4',
        width: 60,
        height: 60,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    centerIcon: {
        fontSize: 30,
        color: '#fff'
    },
    registroCard: {
        backgroundColor: '#f9f9f9',
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 10,
        // borderLeftWidth: 5,
        // borderLeftColor: '#27B5F4',
        marginBottom: 20,
        elevation: 2,
    },
    registroTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    registroHorarios: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    horarioItem: {
        alignItems: 'center',
    },
    horarioLabel: {
        fontSize: 12,
        color: '#555',
        marginBottom: 4,
    },
    horarioValue: {
        fontSize: 20,
        fontWeight: '900',
        color: 'black',
    },
});
