import {View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity} from 'react-native';
import {colors, sizes} from "../../utils";
import { useEffect, useState } from 'react';

export default function Login() {

    const [email, setEmail] = useState<string | undefined>(undefined)
    const [pass, setPass] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [isEnabled, setIsEnabled] = useState<boolean>(true)
    const [showPass, setShowPass] = useState<boolean>(true)
    
    const handleLogin = ()=>{
        if (!pass || !email){
            setError('Debe completar ambos campos')
            return;
        }
    }

    useEffect(()=>{
        setIsEnabled(email !== undefined && pass !== undefined )
    }, [email,pass])


    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>Bienvenido!</Text>
            <TextInput
                keyboardType={'email-address'}
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passContainer}>
                <TextInput
                    secureTextEntry ={showPass}
                    style={styles.input}
                    placeholder="contraseña"
                    value={pass}
                    onChangeText={setPass}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Text>{showPass ? 'Mostrar' : 'Ocultar'}</Text>
                </TouchableOpacity>
            </View>
            
            {error && <Text style={styles.error}>{error}</Text>}
            <Pressable onPress={handleLogin} disabled={isEnabled}>
                <Text style={isEnabled ? styles.login   : styles.loginDisabled}>Iniciar Sesión</Text>
            </Pressable>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1, 
        alignItems:'center', 
        justifyContent:'center',
        backgroundColor: colors.backgroundColor

    },
    titulo:{
        fontSize:sizes.titulo,
        fontWeight:'bold',
        color:'black'
    },
    passContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    input:{
        height: 50,
        marginTop: 16,
        borderBottomWidth: 1,
        minWidth: 300
    },
    login:{
        marginTop: 16,
        fontSize: 18,
        color: colors.buttonColor
    },
    loginDisabled:{
        marginTop: 16,
        fontSize: 18,
        color: "gray"
    },
    error:{
        color:'red',
        fontSize:10
    }
})