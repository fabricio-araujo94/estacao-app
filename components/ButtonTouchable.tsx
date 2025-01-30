import { StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";

export interface buttonProps {
    onClick: () => void;
    icon: string;
}

export function ButtonTouchable({ onClick, icon } : buttonProps ) {

    return (
        <TouchableOpacity
            onPress={onClick}
            style={styles.round}
        >
            <Image
                style={styles.icon}
                source={icon === 'clothes' ? require('@/assets/images/clothes.png') : require('@/assets/images/window.svg')}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    round: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#D9D9D9',
    },
    icon: {
        width: 34,
        height: 34
    }
})