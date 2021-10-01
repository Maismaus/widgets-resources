import { createElement, FunctionComponent, Fragment } from "react";
import { SvgUri, SvgXml } from "react-native-svg";
import { Image } from "mendix/components/native/Image";
import { Icon } from "mendix/components/native/Icon";

export interface DimensionsType {
    width: number;
    height: number;
    aspectRatio?: number;
}

interface ImageIconSVGProps {
    type?: string;
    image?: any;
    // image: string | number | { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; };
    name?: string;
    dimensions?: DimensionsType;
    initialDimensions?: DimensionsType;
    imageStyles: any;
}

export const ImageIconSVG: FunctionComponent<ImageIconSVGProps> = props => {
    const { type, image, dimensions, initialDimensions, imageStyles } = props;

    return (
        <Fragment>
            {image && (type === "staticImage" || type === "dynamicImage") ? (
                <Image source={image} style={imageStyles(dimensions)} />
            ) : image && type === "staticSVG" && initialDimensions?.width && initialDimensions?.height ? (
                <SvgXml
                    xml={image}
                    color={"black"}
                    fill={"black"}
                    style={imageStyles(dimensions)}
                    height={dimensions?.height}
                    width={dimensions?.width}
                    viewBox={`0 0 ${initialDimensions?.width} ${initialDimensions?.height}`}
                />
            ) : image && type === "dynamicSVG" && initialDimensions?.width && initialDimensions?.height ? (
                <SvgUri
                    uri={image}
                    color={"black"}
                    fill={"black"}
                    {...(dimensions?.height && dimensions?.width
                        ? { width: dimensions?.width, height: dimensions?.height }
                        : null)}
                    viewBox={`0 0 ${initialDimensions?.width} ${initialDimensions?.height}`}
                    style={imageStyles(dimensions)}
                />
            ) : image && type === "icon" ? (
                <Icon icon={image} size={50} />
            ) : null}
        </Fragment>
    );
};
