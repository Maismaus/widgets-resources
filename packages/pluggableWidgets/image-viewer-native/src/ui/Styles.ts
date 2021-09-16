import { ViewStyle, ImageStyle } from "react-native";
import { Style } from "@mendix/piw-native-utils-internal";

export interface CustomImageStyle extends ImageStyle {
    svgColor?: string;
}

export interface ImageViewerStyle extends Style {
    container: ViewStyle;
    image: CustomImageStyle;
    backdrop: ViewStyle;
}

export const defaultImageViewerStyle: ImageViewerStyle = {
    container: {},
    image: {},
    backdrop: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: `rgba(0,0,0,0.8)`
    }
};
