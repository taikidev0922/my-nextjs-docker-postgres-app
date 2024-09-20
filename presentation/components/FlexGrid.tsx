"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  FlexGrid as WjFlexGrid,
  FlexGridCellTemplate,
} from "@mescius/wijmo.react.grid";
import { FlexGrid as FlexGridClass } from "@mescius/wijmo.grid";
import { DataType } from "@mescius/wijmo";
import { useScreenActionMode } from "../hooks/useScreenActionMode";
import LoadingWrapper from "./LoadingWrapper";
import { CustomColumn } from "../hooks/useFlexGrid";
import { GridActionButton } from "@/presentation/components/GridActionButton";

interface FlexGridProps {
  columns: CustomColumn[];
  pending?: boolean;
  fixedHeight?: number;
  addRow: () => void;
  removeRow: () => void;
  copyRow: () => void;
  resetFilter: () => void;
}

export function FlexGrid({
  columns,
  pending,
  fixedHeight,
  setGridRef,
  addRow,
  removeRow,
  copyRow,
  resetFilter,
  ...props
}: FlexGridProps & { setGridRef: (grid: FlexGridClass) => void }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState(600);
  const { isReadOnly } = useScreenActionMode();

  const updateGridHeight = useCallback(() => {
    if (gridRef.current) {
      const gridTop = gridRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - gridTop - 70;
      setGridHeight(Math.max(newHeight, 100));
    }
  }, []);

  const debouncedUpdateGridHeight = useCallback(() => {
    setTimeout(() => {
      updateGridHeight();
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

  const init = useCallback(
    (grid: FlexGridClass) => {
      setGridRef(grid);
    },
    [setGridRef]
  );

  const rowHeaders: CustomColumn[] = useMemo(
    () => [
      {
        header: " ",
        binding: "isSelected",
        dataType: DataType.Boolean,
        width: 40,
        cssClass: "wj-header",
        allowSorting: false,
      },
      {
        header: " ",
        binding: "operationIcon",
        dataType: DataType.String,
        width: 40,
        cssClass: "wj-header",
        allowSorting: false,
        cellTemplate(context) {
          if (!context.item.isSelected) {
            return "";
          }
          if (context.item.operation === "delete") {
            return `<span class="text-white">D</span>`;
          }
          return `<span class="text-white">${
            context.item.id ? "U" : "I"
          }</span>`;
        },
      },
    ],
    []
  );

  const extendedColumns: CustomColumn[] = useMemo(
    () =>
      rowHeaders.concat(
        columns.map((column) => ({
          ...column,
          isReadOnly: isReadOnly,
        }))
      ),
    [rowHeaders, columns, isReadOnly]
  );

  return (
    <div ref={gridRef}>
      <LoadingWrapper pending={pending ?? false} spinnerSize="lg">
        <WjFlexGrid
          initialized={init}
          columns={extendedColumns}
          style={{ height: fixedHeight ?? gridHeight }}
          {...props}
        >
          <FlexGridCellTemplate
            cellType="RowHeader"
            template={(context) => context.row.index + 1}
          />
        </WjFlexGrid>
      </LoadingWrapper>
      <div className="flex space-x-2">
        <GridActionButton type="add" onClick={addRow} />
        <GridActionButton type="remove" onClick={removeRow} />
        <GridActionButton type="copy" onClick={copyRow} />
        <GridActionButton type="filter" onClick={resetFilter} />
      </div>
    </div>
  );
}
