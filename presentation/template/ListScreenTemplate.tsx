import React, { useEffect, useState } from "react";
import { ComboBox } from "@mescius/wijmo.react.input";
import { ComboBox as IComboBox } from "@mescius/wijmo.input";
import { FlexGrid } from "@/presentation/components/FlexGrid";
import { CustomColumn, useFlexGrid } from "@/presentation/hooks/useFlexGrid";
import { Button } from "@/presentation/components/ui/button";
import { ScreenActionTemplate } from "@/presentation/template/ScreenActionTemplate";
import { useScreenActionMode } from "@/presentation/hooks/useScreenActionMode";
import toast, { Toaster } from "react-hot-toast";
import { Accordion } from "@/presentation/components/Accordion";
import { BulkRequest } from "@/domain/common/BulkRequest";
import { BulkResult } from "@/domain/common/BulkResult";

export interface SearchField {
  label: string;
  key: string;
  type: "text" | "select";
  options?: string[];
}

interface ListScreenTemplateProps<T, U> {
  searchFields: SearchField[];
  columns: CustomColumn[];
  fetchService: (params: U) => Promise<T[]>;
  bulkUpdateService: (
    items: (T & BulkRequest)[]
  ) => Promise<(T & BulkResult)[]>;
}

export function ListScreenTemplate<T, U>({
  searchFields,
  columns,
  fetchService,
  bulkUpdateService,
}: ListScreenTemplateProps<T, U>) {
  const { onChangeScreenActionMode, onUpdate } = useScreenActionMode();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<U>({} as U);

  const {
    register,
    setItemsSource,
    getSelectedItems,
    applyResults,
    getOperation,
    getCookie,
  } = useFlexGrid<T>(columns);

  useEffect(() => {
    onChangeScreenActionMode(() => {
      setItemsSource([]);
    });
    onUpdate(async () => {
      const selectedItems = getSelectedItems();
      if (selectedItems.length === 0) {
        toast.error("更新する行を選択してください");
        return;
      }
      try {
        const result = await bulkUpdateService(
          selectedItems.map((item) => ({
            ...item,
            operation: getOperation(item),
            cookie: getCookie(item),
          }))
        );
        applyResults(result);
        if (result.some((r: T & BulkResult) => r.results.length > 0)) {
          toast.error("更新に失敗しました");
        } else {
          toast.success("更新しました");
        }
      } catch (error) {
        toast.error("更新に失敗しました");
        console.error(error instanceof Error ? error.message : "Unknown error");
      }
    });
  }, []);

  const handleSearchFieldChange = (key: string, value: string | null) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  const search = async () => {
    setIsLoading(true);
    try {
      const results = await fetchService(searchParams);
      setItemsSource(results);
      if (results.length === 0) {
        toast.error("検索結果がありません");
      }
    } catch (error) {
      toast.error("検索に失敗しました");
      console.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenActionTemplate>
      <Toaster />
      <Accordion title="検索条件">
        <div className="flex flex-col md:flex-row gap-2 md:items-end">
          {searchFields.map((field) => (
            <div key={field.key} className="flex flex-col w-full md:w-auto">
              <label>{field.label}</label>
              <ComboBox
                textChanged={(sender: IComboBox) =>
                  handleSearchFieldChange(field.key, sender.text)
                }
                itemsSource={
                  field.type === "select" ? field.options : undefined
                }
              />
            </div>
          ))}
          <div className="flex-1 hidden md:block" />
          <Button
            onClick={search}
            variant="primary"
            className="w-full md:w-auto mt-2 md:mt-0"
          >
            検索
          </Button>
        </div>
      </Accordion>
      <Accordion title="検索結果">
        <FlexGrid {...register()} pending={isLoading} />
      </Accordion>
    </ScreenActionTemplate>
  );
}
