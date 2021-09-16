import { ValueStatus } from "mendix";

export function getImageProps(
    datasource: any,
    imageIcon: any,
    imageObject: any,
    imageUrl: any,
    defaultImageDynamic: any
): any {
    const fallback: any = {
        type: undefined,
        image: undefined,
        name: undefined
    };
    switch (datasource) {
        case "image": {
            const imageSource =
                imageObject?.status === ValueStatus.Available
                    ? imageObject
                    : imageObject?.status === ValueStatus.Unavailable &&
                      defaultImageDynamic?.status === ValueStatus.Available
                    ? defaultImageDynamic
                    : null;
            if (!imageSource) {
                return null;
            }

            if (typeof imageSource.value === "number") {
                return {
                    type: "staticImage", // Static image
                    image: imageSource.value
                };
            } else if (typeof imageSource.value === "string") {
                return {
                    type: "staticSVG", // Static image SVG
                    image: imageSource.value
                };
            } else if (imageSource.value?.uri && imageSource.value?.name?.endsWith(".svg")) {
                return {
                    type: "dynamicSVG", // Dynamic image SVG
                    image: imageSource.value.uri,
                    name: imageSource.value?.name
                };
            } else if (imageSource.value?.uri) {
                return {
                    type: "dynamicImage", // Dynamic image
                    image: imageSource.value,
                    name: imageSource.value?.name
                };
            }
            return fallback;
        }
        case "imageUrl":
            if (imageUrl?.status === ValueStatus.Available) {
                return {
                    type: imageUrl.value?.endsWith(".svg") ? "dynamicSVG" : "dynamicImage",
                    image: { uri: imageUrl.value }
                };
            }
            return fallback;
        case "icon": {
            if (imageIcon?.status === ValueStatus.Available) {
                if (imageIcon.value?.type === "glyph") {
                    return {
                        type: "icon",
                        image: imageIcon.value
                    };
                }
                if (imageIcon.value?.type === "image") {
                    return {
                        type: "staticImage", // or maybe "icon"
                        image: imageIcon.value
                    };
                }
            }
            return fallback;
        }
        default:
            return fallback;
    }
}
