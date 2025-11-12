import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity, Image, Alert } from 'react-native';
import { colors, sizes } from "../../../utils";
import { useContext, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { GradientButton } from '../../../components/GradientButton';
import { AUTH_ACTIONS, AuthContext } from '../../../shared/context/AuthContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email no válido').required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
});

export default function Login({ navigation }: any) {
    const { state, dispatch } = useContext(AuthContext)

    const [showPass, setShowPass] = useState<boolean>(true);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            console.log('Ingresando con los valores:', values);
            dispatch({
                type: AUTH_ACTIONS.LOGIN,
                payload: {
                    token: "TOKEN",
                    refreshToken: "REFRESH_TOKEN",
                    user: {
                        id: "ID",
                        nombre: "Pancha",
                        apellido: "Pancha",
                        email: "Pancha@mail.com",
                    }
                }
            });
        },
    });

    const handleRegisterLink = () => {
        navigation.navigate('register');
    };

    const isFormEnabled = formik.isValid && formik.dirty;

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/icons/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.inputContainer}>
                <TextInput
                    keyboardType={'email-address'}
                    style={styles.input}
                    placeholder="email"
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                />
                {formik.touched.email && formik.errors.email && (
                    <Text style={styles.error}>{formik.errors.email}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    secureTextEntry={showPass}
                    style={styles.inputWithIcon}
                    placeholder="contraseña"
                    value={formik.values.password}
                    onBlur={formik.handleBlur('password')}
                    onChangeText={formik.handleChange('password')}
                />
                {formik.touched.password && formik.errors.password && (
                    <Text style={styles.error}>{formik.errors.password}</Text>
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

            <GradientButton
                title="Iniciar Sesión"
                onPress={formik.handleSubmit}
                isEnabled={isFormEnabled}
            />

            <TouchableOpacity onPress={handleRegisterLink}>
                <Text style={styles.registerLink}>¿No tenés cuenta? Registrate</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.backgroundColor
    },
    logo: {
        width: 250,
        marginTop: 100,
    },
    input: {
        height: 50,
        marginTop: 16,
        borderBottomWidth: 1,
        borderColor: 'gray',
        minWidth: 280,
        paddingHorizontal: 8,
        fontSize: 16,
        textAlignVertical: 'bottom',
    },
    inputContainer: {
        position: 'relative',
        width: 280,
        marginTop: 16,
    },
    inputWithIcon: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 8,
        paddingRight: 36,
        fontSize: 16,
        textAlignVertical: 'bottom',
    },
    iconWrapper: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -11 }],
    },
    error: {
        color: 'red',
        fontSize: 10,
    },
    registerLink: {
        marginTop: 20,
        color: colors.buttonColor,
        textDecorationLine: 'underline',
        fontSize: 14,
    }
});