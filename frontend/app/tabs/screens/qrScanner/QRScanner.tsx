import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Camera, BarcodeScanningResult, CameraView } from 'expo-camera';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import { StackScreenProps } from '@react-navigation/stack';
import axiosClient from '../../../core/api';
import { colors } from '../../../../utils';
import CustomAlert from '../../../../components/CustomAlert';
import { useCustomAlert } from '../../../../hooks/useCustomAlert';

type FichajeScannerProps = StackScreenProps<any, 'QRScanner'>;

export default function QRScanner({ navigation }: FichajeScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [biometricReady, setBiometricReady] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const { alertData, showAlert, hideAlert } = useCustomAlert();

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

            if (locationStatus !== 'granted') {
                setLocationError('Permiso de ubicación denegado');
            }

            const permissionsGranted =
                cameraStatus === 'granted' && locationStatus === 'granted';

            setHasPermission(permissionsGranted);

            if (permissionsGranted) {
                await authenticateBiometric();
            }
        })();
    }, []);

       const authenticateBiometric = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();

        if (!compatible) {
            Alert.alert("Error", "El dispositivo no soporta autenticación biométrica.");
            return;
        }

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
            Alert.alert("Error", "No hay biometría registrada en este dispositivo.");
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Confirma tu identidad",
            fallbackLabel: "Usar código",
        });

        if (result.success) {
            setBiometricReady(true);
        } else {
            Alert.alert(
                "Autenticación requerida",
                "No se pudo verificar tu identidad.",
                [
                    { text: "Reintentar", onPress: authenticateBiometric },
                    {
                        text: "Cancelar",
                        onPress: () => navigation.goBack(),
                        style: "destructive",
                    },
                ]
            );
        }
    };

    
    const registrarMovimiento = async (qrData: string) => {
        setLoading(true);
        try {
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

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

        } catch (error: any) {
            const backendError = error.response?.data?.error;
            const backendMessage = error.response?.data?.message;

            const mensaje = backendError || backendMessage || "Error al conectar con el servidor.";

            showAlert("Error de Fichaje", mensaje, () => setScanned(false));
        } finally {
            setLoading(false);
        }
    };

    const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
        if (loading || scanned) return;
        setScanned(true);
        registrarMovimiento(data);
    };

 
    if (hasPermission === null || !biometricReady) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10 }}>Preparando escáner...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.center}>
                <Text style={{ textAlign: 'center', padding: 20 }}>
                    Se requiere acceso a cámara y ubicación.
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
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />

            <View style={styles.overlay}>
                {!scanned && (
                    <Text style={styles.scanText}>
                        Escanea el QR de la oficina
                    </Text>
                )}
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
    container: { flex: 1, backgroundColor: '#000' },
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
