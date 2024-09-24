import { useRef, useState } from "react";
import {
  FlexGrid as FlexGridClass,
  CellType,
  ICellTemplateFunction,
} from "@mescius/wijmo.grid";
import { CollectionView } from "@mescius/wijmo";
import { FlexGridFilter, FilterType } from "@mescius/wijmo.grid.filter";
import { cloneDeep, has, assign } from "lodash";
import { BulkResult } from "@/domain/common/BulkResult";

export type CustomColumn = {
  header: string;
  binding: string;
  width?: number;
  dataType: "string" | "number" | "boolean" | "date";
  cssClass?: string;
  allowSorting?: boolean;
  isReadOnly?: boolean;
  cellTemplate?: ICellTemplateFunction;
};

export function useFlexGrid<T>(initialColumns: CustomColumn[]) {
  const gridRef = useRef<FlexGridClass | null>(null);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [filter, setFilter] = useState<FlexGridFilter | null>(null);

  function setGridRef(grid: FlexGridClass) {
    gridRef.current = grid;
    grid.initialize({
      itemsSource: [],
    });
    gridRef.current.selectionChanged.addHandler(() => {
      setCurrentItem(gridRef.current?.collectionView?.currentItem);
    });
    setFilter(new FlexGridFilter(grid));
    const nonefilter = filter?.getColumnFilter("isSelected");
    if (nonefilter) {
      nonefilter.filterType = FilterType.None;
    }
    grid.autoGenerateColumns = false;

    grid.itemsSourceChanged.addHandler(() => {
      grid.collectionView.items.forEach((item) => {
        item.isSelected = false;
      });
    });

    grid.itemFormatter = function (panel, r, c, cell) {
      if (panel.cellType == CellType.Cell) {
        if (c == 1) {
          cell.style.textAlign = "center";
        }
      }
    };
    grid.select(0, 3);
  }

  function getSelectedItems(): T[] {
    gridRef.current?.collectionView?.items?.forEach((item, index) => {
      item.cookie = index;
    });
    return (
      gridRef.current?.collectionView?.items.filter(
        (item) => item.isSelected
      ) || []
    );
  }

  function setItemsSource(items: T[]) {
    if (gridRef.current) {
      gridRef.current.itemsSource = items;
    }
  }

  function addRow() {
    (gridRef.current?.collectionView as CollectionView)?.addNew();
  }

  function removeRow() {
    if (gridRef.current?.collectionView?.currentItem?.id) {
      gridRef.current.beginUpdate();
      const currentOperation =
        gridRef.current.collectionView.currentItem.operation;
      gridRef.current.collectionView.currentItem.operation =
        currentOperation === "delete" ? null : "delete";
      gridRef.current.collectionView.currentItem.isSelected =
        currentOperation === "delete" ? false : true;
      gridRef.current.endUpdate();
      return;
    }
    gridRef.current?.editableCollectionView?.remove(
      gridRef.current.collectionView.currentItem
    );
  }

  function copyRow() {
    const selectedItem = cloneDeep(gridRef.current?.collectionView.currentItem);
    (gridRef.current?.collectionView as CollectionView).addNew({
      ...selectedItem,
      id: null,
      isSelected: true,
    });
  }

  function getOperation(item: T): "save" | "delete" {
    if (
      has(item, "operation") &&
      (item["operation"] === "delete" || item["operation"] === "save")
    ) {
      return item["operation"] as "save" | "delete";
    }
    return "save";
  }

  function getCookie(item: T): number {
    if (has(item, "cookie")) {
      return item["cookie"] as number;
    }
    return 0;
  }

  function applyResults(responses: (T & BulkResult)[]) {
    gridRef.current?.collectionView.items.forEach((item) => {
      item.results = [];
    });
    gridRef.current?.beginUpdate();
    if (responses.some((response) => response.results.length > 0)) {
      responses.forEach((response) => {
        const item = gridRef.current?.collectionView.items.find(
          (item) => item.cookie === response.cookie
        );
        item.results = response.results;
      });
    } else {
      responses.forEach((response) => {
        const item = gridRef.current?.collectionView.items.find(
          (item) => item.cookie === response.cookie
        );

        if (getOperation(item) === "delete") {
          gridRef.current?.editableCollectionView.remove(item);
        } else if (item) {
          assign(item, response);
          item.operation = null;
          item.isSelected = false;
        }
      });
    }
    gridRef.current?.endUpdate();
  }

  function resetFilter() {
    filter?.clear();
  }

  function register() {
    return {
      columns: initialColumns,
      setGridRef,
      addRow,
      removeRow,
      copyRow,
      resetFilter,
    };
  }

  return {
    getSelectedItems,
    register,
    currentItem,
    addRow,
    removeRow,
    copyRow,
    resetFilter,
    setItemsSource,
    getOperation,
    getCookie,
    applyResults,
  };
}
