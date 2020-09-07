import { useSettings } from "../settings";
import { ColumnWidth, TableColumn } from "../../components/Table";
import { EditableValueBuilder } from "@native-mobile-resources/util-widgets";
import { HidableEnum } from "../../../typings/DatagridProps";
import { renderHook } from "@testing-library/react-hooks";

describe("useSettings Hook", () => {
    it("loads correct values into hooks", () => {
        const props = mockProperties();

        renderHook(() =>
            useSettings(
                props.settings,
                props.columns,
                props.columnOrder,
                props.setColumnOrder,
                props.hiddenColumns,
                props.setHiddenColumns,
                props.sortBy,
                props.setSortBy,
                props.filters,
                props.setFilters,
                props.widths,
                props.setWidths
            )
        );
        expect(props.setColumnOrder).toHaveBeenCalledTimes(1);
        expect(props.setHiddenColumns).toHaveBeenCalledTimes(1);
        expect(props.setSortBy).toHaveBeenCalledTimes(1);
        expect(props.setFilters).toHaveBeenCalledTimes(1);
        expect(props.setWidths).toHaveBeenCalledTimes(1);
    });

    it("calls state functions with correct values", () => {
        const props = mockProperties();
        const columns = [
            {
                header: "Column 1",
                hidable: "yes" as HidableEnum
            },
            {
                header: "Column 2",
                hidable: "hidden" as HidableEnum
            }
        ] as TableColumn[];
        const settings = new EditableValueBuilder<string>()
            .withValue(
                JSON.stringify([
                    {
                        column: "Column 1",
                        sort: true,
                        sortMethod: "desc",
                        filter: "ABC",
                        hidden: false,
                        order: 1,
                        width: undefined
                    },
                    {
                        column: "Column 2",
                        sort: false,
                        sortMethod: "asc",
                        filter: "",
                        hidden: true,
                        order: 0,
                        width: 120
                    }
                ])
            )
            .build();

        renderHook(() =>
            useSettings(
                settings,
                columns,
                props.columnOrder,
                props.setColumnOrder,
                props.hiddenColumns,
                props.setHiddenColumns,
                props.sortBy,
                props.setSortBy,
                props.filters,
                props.setFilters,
                props.widths,
                props.setWidths
            )
        );
        expect(props.setColumnOrder).toHaveBeenCalledWith(["1", "0"]);
        expect(props.setHiddenColumns).toHaveBeenCalledWith(["1"]);
        expect(props.setSortBy).toHaveBeenCalledWith([{ id: "0", desc: true }]);
        expect(props.setFilters).toHaveBeenCalledWith([{ id: "0", value: "ABC" }]);
        expect(props.setWidths).toHaveBeenCalledWith({ "0": undefined, "1": 120 });
    });

    it("changes the settings when some property changes", () => {
        const props = mockProperties();

        const { rerender } = renderHook(
            ({
                settings,
                columns,
                columnOrder,
                setColumnOrder,
                hiddenColumns,
                setHiddenColumns,
                sortBy,
                setSortBy,
                filters,
                setFilters,
                widths,
                setWidths
            }) =>
                useSettings(
                    settings,
                    columns,
                    columnOrder,
                    setColumnOrder,
                    hiddenColumns,
                    setHiddenColumns,
                    sortBy,
                    setSortBy,
                    filters,
                    setFilters,
                    widths,
                    setWidths
                ),
            {
                initialProps: {
                    settings: props.settings,
                    columns: props.columns,
                    columnOrder: ["0"],
                    setColumnOrder: props.setColumnOrder,
                    hiddenColumns: [],
                    setHiddenColumns: props.setHiddenColumns,
                    sortBy: [{ id: "0", desc: true }],
                    setSortBy: props.setSortBy,
                    filters: [{ id: "0", value: "ABC" }],
                    setFilters: props.setFilters,
                    widths: { "0": undefined } as ColumnWidth,
                    setWidths: props.setWidths
                }
            }
        );
        expect(props.settings.setValue).toHaveBeenCalledTimes(0);
        rerender({
            settings: props.settings,
            columns: props.columns,
            columnOrder: ["0"],
            setColumnOrder: props.setColumnOrder,
            hiddenColumns: [],
            setHiddenColumns: props.setHiddenColumns,
            sortBy: [{ id: "0", desc: false }],
            setSortBy: props.setSortBy,
            filters: [{ id: "0", value: "A" }],
            setFilters: props.setFilters,
            widths: { "0": 130 },
            setWidths: props.setWidths
        });
        expect(props.settings.setValue).toHaveBeenCalledTimes(1);
        expect(props.settings.setValue).toHaveBeenCalledWith(
            JSON.stringify([
                {
                    column: "Column 1",
                    sort: true,
                    sortMethod: "asc",
                    filter: "A",
                    hidden: false,
                    order: 0,
                    width: 130
                }
            ])
        );
    });
});

function mockProperties(): any {
    return {
        settings: new EditableValueBuilder<string>()
            .withValue(
                JSON.stringify([
                    {
                        column: "Column 1",
                        sort: true,
                        sortMethod: "desc",
                        filter: "ABC",
                        hidden: false,
                        order: 0,
                        width: undefined
                    }
                ])
            )
            .build(),
        columns: [
            {
                header: "Column 1",
                hidable: "yes" as HidableEnum
            }
        ] as TableColumn[],
        columnOrder: [],
        setColumnOrder: jest.fn(),
        hiddenColumns: [],
        setHiddenColumns: jest.fn(),
        sortBy: [],
        setSortBy: jest.fn(),
        filters: [],
        setFilters: jest.fn(),
        widths: { "0": undefined },
        setWidths: jest.fn()
    };
}