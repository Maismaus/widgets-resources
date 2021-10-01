import { createElement, FunctionComponent, useState, Fragment, useEffect, useCallback } from "react";
import { Modal, Pressable, Image as RNImage, LayoutChangeEvent } from "react-native";
import { SvgUri } from "react-native-svg";
import { flattenStyles, Style } from "@mendix/piw-native-utils-internal";
import { defaultImageViewerStyle } from "./ui/Styles";
import { ImageViewerProps } from "../typings/ImageProps";
import { calculateSvgDimensions } from "./utils/svgUtils";
import { DimensionsType, ImageIconSVG } from "./components/ImageIconSVG";
import { getImageProps } from "./utils/imageUtils";

export const ImageViewer: FunctionComponent<ImageViewerProps<Style>> = props => {
    const styles = flattenStyles(defaultImageViewerStyle, props.style);
    // const onClick = useCallback(() => props.onClick?.execute(), [props.onClick]);
    const [enlarged, setEnlarged] = useState(false);
    const [source, setSource] = useState<any>({ type: "", image: "" });
    const [initialDimensions, setInitialDimensions] = useState<DimensionsType>();
    const [dimensionsSmall, setDimensionsSmall] = useState<DimensionsType>();
    const [dimensionsLarge, setDimensionsLarge] = useState<DimensionsType>();

    const getImageDimensions = useCallback(
        async (): Promise<DimensionsType> =>
            new Promise((resolve, reject) => {
                switch (source?.type) {
                    case "staticImage":
                        const { width, height } = RNImage.resolveAssetSource(source?.image);
                        resolve({
                            width,
                            height
                        });
                        break;
                    case "dynamicImage":
                        RNImage.getSize(source.image.uri, (width, height) => resolve({ width, height }), reject);
                        break;
                    case "staticSVG":
                        resolve(calculateSvgDimensions(source.image));
                        break;
                    case "dynamicSVG":
                        resolve({ width: 0, height: 0 });
                        break;
                    default:
                        resolve({ width: 0, height: 0 });
                        break;
                }
            }),
        [source]
    );

    const imageStyles = useCallback(
        (dimensions?: DimensionsType) => [
            {
                width: dimensions?.width,
                height: dimensions?.height,
                aspectRatio: initialDimensions?.aspectRatio
            },
            { maxWidth: "100%", maxHeight: "100%", resizeMode: "contain" },
            styles.image
        ],
        [initialDimensions?.aspectRatio, styles.image]
    );

    const onLayoutSetInitialDimensions = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        const width = layout.width;
        const height = layout.height;
        setInitialDimensions({
            width,
            height,
            aspectRatio: width && height ? width / height : undefined
        });
    }, []);
    const onLayoutSetDimensions = useCallback(
        ({ nativeEvent: { layout } }: LayoutChangeEvent, setDimensions): void => {
            const width = layout.width;
            const height = layout.height;

            if (initialDimensions?.width && initialDimensions?.height) {
                setDimensions({
                    width:
                        height < initialDimensions.height
                            ? (height / initialDimensions.height) * initialDimensions.width
                            : height > initialDimensions.height
                            ? initialDimensions.height
                            : width,
                    height:
                        width < initialDimensions.width
                            ? (width / initialDimensions.width) * initialDimensions.height
                            : width > initialDimensions.width
                            ? initialDimensions.width
                            : height
                });
            }
        },
        [initialDimensions?.width, initialDimensions?.height]
    );

    useEffect(() => {
        setSource(
            getImageProps(
                props.datasource,
                props.imageIcon,
                props.imageObject,
                props.imageUrl,
                props.defaultImageDynamic
            )
        );
    }, [props.datasource, props.imageIcon, props.imageObject, props.imageUrl, props.defaultImageDynamic]);

    useEffect(() => {
        const setImageDimensions = async (): Promise<void> => {
            const { width, height } = await getImageDimensions();
            setDimensionsSmall({
                width,
                height
            });
            setInitialDimensions({
                width,
                height,
                aspectRatio: width && height ? width / height : undefined
            });
        };
        setImageDimensions();
    }, [source?.image, getImageDimensions]);

    return (
        <Fragment>
            <Pressable
                onPress={() => setEnlarged(true)}
                onLayout={event => onLayoutSetDimensions(event, setDimensionsSmall)}
            >
                <ImageIconSVG
                    {...source}
                    dimensions={dimensionsSmall}
                    initialDimensions={initialDimensions}
                    imageStyles={imageStyles}
                />
            </Pressable>
            <Modal
                visible={enlarged || !initialDimensions?.width || !initialDimensions?.height}
                onRequestClose={() => setEnlarged(false)}
                onDismiss={() => setEnlarged(false)}
                transparent
                animationType="fade"
                supportedOrientations={[
                    "portrait",
                    "portrait-upside-down",
                    "landscape",
                    "landscape-left",
                    "landscape-right"
                ]}
            >
                {/* Render dynamicSVG once to get initial dimensions */}
                {source?.image &&
                source.type === "dynamicSVG" &&
                (!initialDimensions?.width || !initialDimensions?.height) ? (
                    <SvgUri
                        uri={source.image}
                        onLayout={event => onLayoutSetInitialDimensions(event)}
                        style={{ opacity: 0 }}
                    />
                ) : null}

                {initialDimensions?.width && initialDimensions?.height ? (
                    <Pressable
                        onPress={() => setEnlarged(false)}
                        onLayout={event => onLayoutSetDimensions(event, setDimensionsLarge)}
                        style={styles.backdrop}
                    >
                        <Pressable onPress={null} style={{ borderWidth: 3, borderColor: "red" }}>
                            <ImageIconSVG
                                {...source}
                                dimensions={dimensionsLarge}
                                initialDimensions={initialDimensions}
                                imageStyles={imageStyles}
                            />
                        </Pressable>
                    </Pressable>
                ) : null}
            </Modal>
        </Fragment>
    );
};
