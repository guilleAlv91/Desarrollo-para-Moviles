import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { colors, sizes } from '../../utils';
import { GradientButton } from '../../components/GradientButton';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Email no válido').required('El email es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});

export default function Register({ navigation }: any) {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            console.log('Registrando con los valores:', values);
            Alert.alert('¡Ya creaste tu usuario!', 'Ahora podes iniciar sesión.');
        },
    });

    const isFormEnabled = formik.isValid && formik.dirty;

    const handleLoginLink = () => {
        navigation.navigate('login');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crea tu cuenta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                onChangeText={formik.handleChange('name')}
                onBlur={formik.handleBlur('name')}
                value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
                <Text style={styles.errorText}>{formik.errors.name}</Text>
            )}

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
                <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
                <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}

            <GradientButton
                title="Registrarse"
                onPress={formik.handleSubmit}
                isEnabled={isFormEnabled}
            />

            <TouchableOpacity style={styles.loginLink} onPress={handleLoginLink}>
                <Text style={styles.loginText}>¿Ya tenes una cuenta? Inicia sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: colors.backgroundColor,
    },
    title: {
        fontSize: sizes.titulo,
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'black',
    },
    input: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingHorizontal: 8,
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
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