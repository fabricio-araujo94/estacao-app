import { scale, verticalScale, moderateScale } from "react-native-size-matters"

export const rS = (size: number) => {
    return scale(size);
}

export const rVS = (size: number) => {
    return verticalScale(size);
}

export const rMS = (size: number, factor: number) => {
    return moderateScale(size, factor);
}