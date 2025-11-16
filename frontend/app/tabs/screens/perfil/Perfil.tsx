import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InformacionPersonal({ navigation }: any) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Información personal</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <MaterialCommunityIcons name="account" size={70} color="#bbb" />
                </View>
                <TouchableOpacity style={styles.editButton}>
                    <MaterialCommunityIcons name="pencil" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Lista de datos */}
            <View style={styles.list}>
                <TouchableOpacity style={styles.item}>
                    <MaterialCommunityIcons name="email-outline" size={24} color='#27B5F4' />
                    <View style={styles.itemContent}>
                        <Text style={styles.label}>Usuario (Correo electrónico)</Text>
                        <Text style={styles.value}>usuario@ejemplo.com</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.separator} />

                <View style={styles.item}>
                    <MaterialCommunityIcons name="card-account-details-outline" size={24} color='#27B5F4' />
                    <View style={styles.itemContent}>
                        <Text style={styles.label}>CUIL</Text>
                        <Text style={styles.value}>N-DNI-N</Text>
                    </View>
                </View>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.item}>
                    <MaterialCommunityIcons name="account-outline" size={24} color='#27B5F4' />
                    <View style={styles.itemContent}>
                        <Text style={styles.label}>Nombre</Text>
                        <Text style={styles.value}>nombre de usuario</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.item}>
                    <MaterialCommunityIcons name="account-outline" size={24} color='#27B5F4' />
                    <View style={styles.itemContent}>
                        <Text style={styles.label}>Apellido</Text>
                        <Text style={styles.value}>apellido usuario</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.item}>
                    <MaterialCommunityIcons name="cellphone" size={24} color='#27B5F4' />
                    <View style={styles.itemContent}>
                        <Text style={styles.label}>Celular personal</Text>
                        <Text style={styles.value}>+54 . .. .... ....</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.item}>
                    <MaterialCommunityIcons name="email-plus-outline" size={24} color='#27B5F4' />
                    <View style={styles.itemContent}>
                        <Text style={styles.label}>Correo electrónico alternativo</Text>
                        <Text style={styles.value}>otrocorreo@ejemplo.com</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.item}>
                    <MaterialCommunityIcons name="translate" size={24} color='#27B5F4' />
                    <View style={styles.itemContent}>
                        <Text style={styles.label}>Idioma</Text>
                        <Text style={styles.value}>Español</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: "center",
    },
    title: { fontSize: 20, fontWeight: "bold", color: "black" },
    profileSection: {
        alignItems: "center",
        marginVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    editButton: {
        position: "absolute",
        bottom: 0,
        right: 120,
        backgroundColor: '#27B5F4',
        borderRadius: 20,
        padding: 6,
    },
    list: {
        marginHorizontal: 20,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
    },
    itemContent: {
        marginLeft: 15,
    },
    label: {
        fontSize: 14,
        color: "#555",
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginLeft: 50,
    },
});