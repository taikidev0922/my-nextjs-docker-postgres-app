"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  FlexGrid as WjFlexGrid,
  FlexGridCellTemplate,
} from "@mescius/wijmo.react.grid";
import { FlexGrid as FlexGridClass } from "@mescius/wijmo.grid";
import { DataType } from "@mescius/wijmo";
import { FlexGridFilter, FilterType } from "@mescius/wijmo.grid.filter";
import { useScreenActionMode } from "../hooks/useScreenActionMode";
import LoadingWrapper from "./LoadingWrapper";

type CustomColumn = {
  header: string;
  binding: string;
  width?: number;
  dataType?: DataType;
  cssClass?: string;
  allowSorting?: boolean;
  isReadOnly?: boolean;
};

interface FlexGridProps<T> {
  itemsSource: T[];
  columns: CustomColumn[];
  pending: boolean;
}

export function FlexGrid<T>({
  itemsSource,
  columns,
  pending,
}: FlexGridProps<T>) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState(600);
  const { isReadOnly } = useScreenActionMode();

  const updateGridHeight = useCallback(() => {
    if (gridRef.current) {
      const gridTop = gridRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - gridTop - 25;
      setGridHeight(Math.max(newHeight, 100));
    }
  }, []);

  const debouncedUpdateGridHeight = useCallback(() => {
    setTimeout(() => {
      updateGridHeight();
      // アニメーション完了後に再度調整
      setTimeout(updateGridHeight, 200);
    }, 50);
  }, [updateGridHeight]);

  useEffect(() => {
    updateGridHeight();
    window.addEventListener("resize", debouncedUpdateGridHeight);

    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" || mutation.type === "childList") {
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        debouncedUpdateGridHeight();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    // トランジション終了イベントのリスナーを追加
    const transitionEndListener = (event: TransitionEvent) => {
      if (event.propertyName === "height") {
        updateGridHeight();
      }
    };
    document.body.addEventListener("transitionend", transitionEndListener);

    return () => {
      window.removeEventListener("resize", debouncedUpdateGridHeight);
      observer.disconnect();
      document.body.removeEventListener("transitionend", transitionEndListener);
    };
  }, [updateGridHeight, debouncedUpdateGridHeight]);

  const init = (grid: FlexGridClass) => {
    const filter = new FlexGridFilter(grid);
    const nonefilter = filter.getColumnFilter("isSelected");
    nonefilter.filterType = FilterType.None;

    grid.itemsSourceChanged.addHandler(() => {
      grid.collectionView.items.forEach((item) => {
        item.isSelected = false;
      });
    });
  };

  const rowHeaders: CustomColumn[] = [
    {
      header: " ",
      binding: "isSelected",
      dataType: DataType.Boolean,
      width: 50,
      cssClass: "wj-header",
      allowSorting: false,
    },
  ];

  const extendedColumns: CustomColumn[] = rowHeaders.concat(
    columns.map((column) => ({
      ...column,
      isReadOnly: isReadOnly,
    }))
  );

  return (
    <div ref={gridRef}>
      <LoadingWrapper pending={pending} spinnerSize="lg">
        <WjFlexGrid
          initialized={init}
          itemsSource={itemsSource}
          columns={extendedColumns}
          style={{ height: gridHeight }}
        >
          <FlexGridCellTemplate
            cellType="RowHeader"
            template={(context) => context.row.index + 1}
          />
        </WjFlexGrid>
      </LoadingWrapper>
    </div>
  );
}
