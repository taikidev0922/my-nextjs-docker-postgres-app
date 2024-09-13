"use clinet";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  FlexGrid as WjFlexGrid,
  FlexGridCellTemplate,
} from "@mescius/wijmo.react.grid";
import { FlexGrid as FlexGridClass } from "@mescius/wijmo.grid";
import { DataType } from "@mescius/wijmo";
import { FlexGridFilter, FilterType } from "@mescius/wijmo.grid.filter";
import { useScreenActionMode } from "../hooks/useScreenActionMode";

interface FlexGridProps {
  itemsSource: any[];
  columns: any[];
}

export function FlexGrid({ itemsSource, columns }: FlexGridProps) {
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
    let filter = new FlexGridFilter(grid);
    var nonefilter = filter.getColumnFilter("isSelected");
    nonefilter.filterType = FilterType.None;

    grid.itemsSourceChanged.addHandler((_, e) => {
      grid.collectionView.items.forEach((item) => {
        item.isSelected = false;
      });
    });
  };

  const rowHeaders = [
    {
      header: " ",
      binding: "isSelected",
      dataType: DataType.Boolean,
      width: 50,
      cssClass: "wj-header",
      allowSorting: false,
    },
  ];

  const extendedColumns = rowHeaders.concat(
    columns.map((column) => ({
      ...column,
      isReadOnly: isReadOnly,
    }))
  );

  return (
    <div ref={gridRef}>
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
    </div>
  );
}
