import { useRef, useState } from "react";
import {
  FlexGrid as FlexGridClass,
  CellType,
  ICellTemplateFunction,
} from "@mescius/wijmo.grid";
import { DataType, CollectionView } from "@mescius/wijmo";
import { FlexGridFilter, FilterType } from "@mescius/wijmo.grid.filter";
import { cloneDeep, has, assign } from "lodash";

export type CustomColumn = {
  header: string;
  binding: string;
  width?: number;
  dataType?: DataType;
  cssClass?: string;
  allowSorting?: boolean;
  isReadOnly?: boolean;
  cellTemplate?: ICellTemplateFunction;
};

export function useFlexGrid<T>(initialColumns: CustomColumn[]) {
  const gridRef = useRef<FlexGridClass | null>(null);
  const [currentItem, setCurrentItem] = useState<T | null>(null);

  function setGridRef(grid: FlexGridClass) {
    gridRef.current = grid;
    gridRef.current.selectionChanged.addHandler(() => {
      setCurrentItem(gridRef.current?.collectionView?.currentItem);
    });
    const filter = new FlexGridFilter(grid);
    const nonefilter = filter.getColumnFilter("isSelected");
    nonefilter.filterType = FilterType.None;
    grid.autoGenerateColumns = false;

    grid.itemsSourceChanged.addHandler(() => {
      grid.collectionView.items.forEach((item) => {
        item.isSelected = false;
      });
    });

    grid.itemFormatter = function (panel, r, c, cell) {
      if (panel.cellType == CellType.Cell) {
        cell.style.backgroundColor = "";
        if (c == 1) {
          cell.style.textAlign = "center";
          if (
            grid.collectionView.items[r].isSelected &&
            grid.collectionView.items[r].operation === "delete"
          ) {
            cell.style.backgroundColor = "#ff0000";
          } else if (grid.collectionView.items[r].isSelected) {
            cell.style.backgroundColor = grid.collectionView.items[r].id
              ? "#66ff33"
              : "#3366ff";
          } else {
            cell.style.backgroundColor = "";
          }
        }
      }
    };
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
    (gridRef.current?.collectionView as CollectionView).addNew();
  }

  function removeRow() {
    if (gridRef.current?.collectionView.currentItem.id) {
      gridRef.current.beginUpdate();
      gridRef.current.collectionView.currentItem.operation = "delete";
      gridRef.current.collectionView.currentItem.isSelected = true;
      gridRef.current.endUpdate();
      return;
    }
    gridRef.current?.editableCollectionView.remove(
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

  function applyResults(results: (T & { cookie: number })[]) {
    gridRef.current?.beginUpdate();
    results.forEach((result) => {
      const item = gridRef.current?.collectionView.items.find(
        (item) => item.cookie === result.cookie
      );
      if (item) {
        assign(item, result);
        item.operation = null;
        item.isSelected = false;
      }
    });
    gridRef.current?.endUpdate();
  }

  function resetFilter() {}

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
