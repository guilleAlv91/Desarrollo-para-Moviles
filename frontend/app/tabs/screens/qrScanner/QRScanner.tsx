import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Camera, BarcodeScanningResult, CameraView } from 'expo-camera';
import * as Location from 'expo-location'; // <--- IMPORTAR ESTO
import { StackScreenProps } from '@react-navigation/stack';
import axiosClient from '../../../core/api';
import { colors } from '../../../../utils';
import CustomAlert from '../../../../components/CustomAlert';
import { useCustomAlert } from '../../../../hooks/useCustomAlert';

type FichajeScannerProps = StackScreenProps<any, 'QRScanner'>;

// EL QR A ESCANEAR DEBE DECIR LABURO_SEDE_PRINCIPAL_ENTRADA_UUID_842a

export default function QRScanner({ navigation }: FichajeScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const { alertData, showAlert, hideAlert } = useCustomAlert();

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();

            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

            setHasPermission(cameraStatus === 'granted' && locationStatus === 'granted');

            if (locationStatus !== 'granted') {
                setLocationError('Permiso de ubicación denegado');
                Alert.alert("Permiso requerido", "Necesitamos tu ubicación para verificar que estás en la oficina.");
            }
        })();
    }, []);

    const registrarMovimiento = async (qrData: string) => {
        setLoading(true);
        try {
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            console.log(`QR: ${qrData}`);
            console.log(`Ubicación: ${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}`);

            const response = await axiosClient.post('/asistencias/fichar', {
                qrData: qrData,
                latitud: currentLocation.coords.latitude,
                longitud: currentLocation.coords.longitude,
            });

            const tipoFichaje = response.data?.horaEgreso ? 'Egreso' : 'Ingreso';

            showAlert(
                "Fichaje Exitoso",
                `¡${tipoFichaje} registrado con éxito!`,
                () => navigation.goBack()
            );
            // Alert.alert(
            //     "Fichaje Exitoso",
            //     `¡${tipoFichaje} registrado con éxito! \n\nHora: ${new Date().toLocaleTimeString('es-ES', {
            //         hour: '2-digit',
            //         minute: '2-digit',
            //         hour12: false,
            //     })}`,
            //     [{ text: "OK", onPress: () => navigation.goBack() }]
            // );
        } catch (error: any) {
            const backendError = error.response?.data?.error;
            const backendMessage = error.response?.data?.message;

            const mensaje = backendError || backendMessage || "Error al conectar con el servidor.";

            showAlert("Error de Fichaje", mensaje, () => setScanned(false));


            // Alert.alert("Error de Fichaje", mensaje, [
            //     { text: "OK", onPress: () => setScanned(false) }
            // ]);
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
        return (
            <View style={styles.center}>
                <Text style={{ textAlign: 'center', padding: 20 }}>
                    Se requiere acceso a la cámara y a la ubicación para fichar.
                    {locationError && `\n\nError: ${locationError}`}
                </Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10 }}>Registrando...</Text>
            </View>
        );
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
            <View style={styles.overlay}>
                {!scanned && <Text style={styles.scanText}>Escanea el QR de la oficina</Text>}
            </View>
            <CustomAlert
                visible={alertData.visible}
                title={alertData.title}
                message={alertData.message}
                buttonText={alertData.buttonText}
                onClose={hideAlert}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 100,
    },
    scanText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 15,
        borderRadius: 10,
        overflow: 'hidden'
    }
});