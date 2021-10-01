import {
    hidePropertiesIn,
    hidePropertyIn,
    Problem,
    Properties,
    StructurePreviewProps
} from "@mendix/piw-utils-internal";
import { DatasourceEnum, ImageViewerPreviewProps } from "../typings/ImageProps";
import StructurePreviewImageViewerSvg from "./assets/placeholder.svg";

type ImageViewPreviewPropsKey = keyof ImageViewerPreviewProps;

const dataSourceProperties: ImageViewPreviewPropsKey[] = ["imageObject", "imageUrl", "imageIcon"];

function filterDataSourceProperties(sourceProperty: DatasourceEnum): ImageViewPreviewPropsKey[] {
    switch (sourceProperty) {
        case "image":
            return dataSourceProperties.filter(prop => prop !== "imageObject");
        case "imageUrl":
            return dataSourceProperties.filter(prop => prop !== "imageUrl");
        case "icon":
            return dataSourceProperties.filter(prop => prop !== "imageIcon");
        default:
            return dataSourceProperties;
    }
}

export function getProperties(values: ImageViewerPreviewProps, defaultProperties: Properties): Properties {
    hidePropertiesIn(defaultProperties, values, filterDataSourceProperties(values.datasource));

    if (values.datasource !== "image") {
        hidePropertyIn(defaultProperties, values, "defaultImageDynamic");
    }

    if (values.onClickType !== "action") {
        hidePropertyIn(defaultProperties, values, "onClick");
    }

    return defaultProperties;
}

export function getPreview(): StructurePreviewProps | null {
    return {
        type: "Image",
        document: decodeURIComponent(StructurePreviewImageViewerSvg.replace("data:image/svg+xml,", "")),
        height: 100,
        width: 100
    };
}

export function check(values: ImageViewerPreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (values.datasource === "imageUrl" && !values.imageUrl) {
        errors.push({
            property: "imageUrl",
            message: "No image link provided"
        });
    }
    if (values.datasource === "icon" && !values.imageIcon) {
        errors.push({
            property: "imageIcon",
            message: "No icon selected"
        });
    }

    return errors;
}
