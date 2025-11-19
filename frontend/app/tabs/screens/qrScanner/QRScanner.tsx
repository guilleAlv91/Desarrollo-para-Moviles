import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Camera, BarcodeScanningResult, CameraView } from 'expo-camera';
import { StackScreenProps } from '@react-navigation/stack';
import axiosClient from '../../../core/api';
import { colors } from '../../../../utils';

type FichajeScannerProps = StackScreenProps<any, 'QRScanner'>;

// EL QR A ESCANEAR DEBE DECIR LABURO_SEDE_PRINCIPAL_ENTRADA_UUID_842a

export default function QRScanner({ navigation }: FichajeScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const registrarMovimiento = async (qrData: string) => {
        setLoading(true);
        try {
            console.log(`QR Info: ${qrData}`);

            const response = await axiosClient.post('/asistencias/fichar', {
                qrData: qrData,
                // observaciones: 'Se me rompio el auto.'
            });

            const tipoFichaje = response.data?.horaEgreso ? 'Egreso' : 'Ingreso';

            Alert.alert(
                "Fichaje Exitoso",
                `¡${tipoFichaje} registrado con éxito! Hora: ${new Date().toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })}`
            );
            navigation.goBack();
        } catch (error: any) {
            const mensaje = error.response?.data?.error || "Error al conectar con el servidor.";
            Alert.alert("Error de Fichaje", mensaje);
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
        if (loading || scanned) return;
        setScanned(true);
        registrarMovimiento(data);
    };

    if (hasPermission === null) {
        return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.center}><Text>Acceso a la cámara denegado.</Text></View>;
    }
    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text>Registrando...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />
            {!scanned && <Text style={styles.scanText}>Escanea el código QR para fichar</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        // backgroundColor: '#000',
        // justifyContent: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    scanText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        position: 'absolute',
        top: 110,
        padding: 10,
        backgroundColor: '#000',
        width: '100%'
    }
});