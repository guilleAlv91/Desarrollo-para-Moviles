import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity, Image } from 'react-native';
import { colors, sizes } from "../../utils";
import { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { GradientButton } from '../../components/GradientButton';

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [showPass, setShowPass] = useState<boolean>(true);

    const handleLogin = () => {
        if (!pass || !email) {
            setError('Debe completar ambos campos');
            return;
        }
        navigation.navigate('home');
    };

    const handleRegisterLink = () => {
        navigation.navigate('register');
    };

    useEffect(() => {
        setIsEnabled(email !== '' && pass !== '');
    }, [email, pass]);

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/icons/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <TextInput
                keyboardType={'email-address'}
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passContainer}>
                <TextInput
                    secureTextEntry={showPass}
                    style={styles.inputWithIcon}
                    placeholder="contraseña"
                    value={pass}
                    onChangeText={setPass}
                />
                {pass?.length > 0 && (
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

            {error && <Text style={styles.error}>{error}</Text>}

            <GradientButton
                title="Iniciar Sesión"
                onPress={handleLogin}
                isEnabled={isEnabled}
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
    passContainer: {
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
        fontSize: 10
    },
    registerLink: {
        marginTop: 20,
        color: colors.buttonColor,
        textDecorationLine: 'underline',
        fontSize: 14,
    }
});