import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../../../shared/context/AuthContext';

export default function Inicio({ navigation }: any) {
    const { state } = useContext(AuthContext);
    const { user, isLoading } = state;

    const handlePerfil = () => {
        navigation.navigate('perfil');
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.empresa}>Empresa S.A.</Text>
                <Text>Hola, {user ? user.nombre : '!'}</Text>
            </View>

            <View style={styles.sections}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.card}>
                        <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
                        <Text style={styles.label}>Marcar Ingreso/Salida</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <MaterialCommunityIcons name="history" size={30} color="black" />
                        <Text style={styles.label}>Historial de marcación</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.card} onPress={handlePerfil}>
                        <MaterialCommunityIcons name="account-circle" size={30} color="black" />
                        <Text style={styles.label}>Perfil</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.card}>
                        <MaterialCommunityIcons name="cog-outline" size={30} color="black" />
                        <Text style={styles.label}>Configuración</Text>
                    </TouchableOpacity>

                </View>
            </View>

            {/* <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem}>
            <MaterialCommunityIcons name="home-outline" size={24} color="black" />
            <Text style={styles.bottomLabel}>Inicio</Text>
        </TouchableOpacity>


       <TouchableOpacity style={styles.centerButton}>
            <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
       </TouchableOpacity>


        <TouchableOpacity style={styles.bottomItem}>
            <MaterialCommunityIcons name="menu" size={24} color="black" />
            <Text style={styles.bottomLabel}>Más</Text>
        </TouchableOpacity>

      </View> */}
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
        marginTop: 40
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
});
