/**
 * This file was generated from ImageViewer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, NativeIcon, NativeImage } from "mendix";

export type DatasourceEnum = "image" | "imageUrl" | "icon";

export type OnClickTypeEnum = "action" | "enlarge";

export interface ImageViewerProps<Style> {
    name: string;
    style: Style[];
    datasource: DatasourceEnum;
    imageObject?: DynamicValue<NativeImage>;
    defaultImageDynamic?: DynamicValue<NativeImage>;
    imageUrl?: DynamicValue<string>;
    imageIcon?: DynamicValue<NativeIcon>;
    onClickType: OnClickTypeEnum;
    onClick?: ActionValue;
}

export interface ImageViewerPreviewProps {
    class: string;
    style: string;
    datasource: DatasourceEnum;
    imageObject: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
    defaultImageDynamic: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
    imageUrl: string;
    imageIcon: { type: "glyph"; iconClass: string } | { type: "image"; imageUrl: string } | null;
    onClickType: OnClickTypeEnum;
    onClick: {} | null;
}
