import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { colors, sizes } from '../../../utils';
import { GradientButton } from '../../../components/GradientButton';
import { RegisterFormValues, RegisterPayload } from '../../../shared/interfaces';
import axiosClient from '../../core/api';
import { Entypo } from '@expo/vector-icons';

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    email: Yup.string().email('Email no válido').required('El email es obligatorio'),
    password: Yup.string().min(8, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Las contraseñas no coinciden')
        .required('Debes confirmar tu contraseña'),
});

export default function Register({ navigation }: any) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPass, setShowPass] = useState<boolean>(true);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(true);

    const handleRegister = (values: RegisterFormValues) => {
        setIsLoading(true);
        const { confirmPassword, ...dataToSend } = values;
        axiosClient.post('/auth/register', dataToSend as RegisterPayload)
            .then(result => {
                Alert.alert(
                    '¡Cuenta creada!',
                    'Ahora podes iniciar sesión.',
                    [{ text: 'OK', onPress: () => navigation.navigate('login') }]
                );
            }).catch(err => {
                const message = err.response?.data?.message || 'Verifica los datos e intenta nuevamente';
                Alert.alert('Error en el registro', Array.isArray(message) ? message[0] : message);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleRegister
    });

    const isFormEnabled = formik.isValid && formik.dirty;

    const handleLoginLink = () => {
        navigation.navigate('login');
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <Image
                    source={require("../../../assets/icons/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Crea tu cuenta</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    onChangeText={formik.handleChange('nombre')}
                    onBlur={formik.handleBlur('nombre')}
                    value={formik.values.nombre}
                    editable={!isLoading}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                    <Text style={styles.errorText}>{formik.errors.nombre}</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    onChangeText={formik.handleChange('apellido')}
                    onBlur={formik.handleBlur('apellido')}
                    value={formik.values.apellido}
                    editable={!isLoading}
                />
                {formik.touched.apellido && formik.errors.apellido && (
                    <Text style={styles.errorText}>{formik.errors.apellido}</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    value={formik.values.email}
                    editable={!isLoading}
                />
                {formik.touched.email && formik.errors.email && (
                    <Text style={styles.errorText}>{formik.errors.email}</Text>
                )}
                <View style={styles.inputContainer}>

                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Contraseña"
                        secureTextEntry={showPass}
                        onChangeText={formik.handleChange('password')}
                        onBlur={formik.handleBlur('password')}
                        value={formik.values.password}
                        editable={!isLoading}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <Text style={styles.errorText}>{formik.errors.password}</Text>
                    )}
                    {formik.values.password?.length > 0 && (
                        <TouchableOpacity
                            style={styles.iconWrapper}
                            onPress={() => setShowPass(!showPass)}

                        >
                            {showPass
                                ? <Entypo name="eye" size={22} color="gray" />
                                : <Entypo name="eye-with-line" size={22} color="gray" />}
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Confirmar contraseña"
                        secureTextEntry={showConfirmPass}
                        onChangeText={formik.handleChange('confirmPassword')}
                        onBlur={formik.handleBlur('confirmPassword')}
                        value={formik.values.confirmPassword}
                        editable={!isLoading}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
                    )}
                    {formik.values.confirmPassword?.length > 0 && (
                        <TouchableOpacity
                            style={styles.iconWrapper}
                            onPress={() => setShowConfirmPass(!showConfirmPass)}

                        >
                            {showConfirmPass
                                ? <Entypo name="eye" size={22} color="gray" />
                                : <Entypo name="eye-with-line" size={22} color="gray" />}
                        </TouchableOpacity>
                    )}
                </View>
                <GradientButton
                    title="Registrarse"
                    onPress={formik.handleSubmit}
                    isEnabled={isFormEnabled}
                    isLoading={isLoading}
                />

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={handleLoginLink}
                    disabled={isLoading}
                >
                    <Text style={styles.loginText}>¿Ya tenes una cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.backgroundColor,
        paddingBottom: 50
    },
    logo: {
        width: 250,
        marginTop: 40,
    },
    title: {
        fontSize: sizes.titulo,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    input: {
        width: '80%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingHorizontal: 8,
        fontSize: 16,
        marginBottom: 5,
    },
    inputContainer: {
        position: 'relative',
        width: '80%'
    },
    inputWithIcon: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 8,
        paddingRight: 36,
        fontSize: 16,
    },
    iconWrapper: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -11 }],
    },
    errorText: {
        color: 'red',
        fontSize: 10,
        textAlign: 'left',
        width: '80%'
    },
    loginLink: {
        marginTop: 20,
    },
    loginText: {
        color: colors.buttonColor,
        textDecorationLine: 'underline',
        fontSize: 14,
    },
});