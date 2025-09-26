import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    isEnabled: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ title, onPress, isEnabled }) => {
    return (
        <Pressable onPress={onPress} disabled={!isEnabled} style={styles.buttonWrapper}>
            {isEnabled ? (
                <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fullGradientButton}
                >
                    <Text style={styles.textEnabled}>{title}</Text>
                </LinearGradient>
            ) : (
                <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorder}
                >
                    <View style={styles.buttonDisabled}>
                        <Text style={styles.textDisabled}>{title}</Text>
                    </View>
                </LinearGradient>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        width: 280,
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 20,
    },
    fullGradientButton: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textEnabled: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    gradientBorder: {
        padding: 2,
        borderRadius: 25,
    },
    buttonDisabled: {
        backgroundColor: colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        borderRadius: 23,
    },
    textDisabled: {
        fontSize: 18,
        color: "gray",
        fontWeight: 'bold',
    }
});