"use client";
import { ComboBox } from "@mescius/wijmo.react.input";
import { ComboBox as IComboBox } from "@mescius/wijmo.input";
import { useEffect, useState } from "react";
import { FlexGrid } from "@/presentation/components/FlexGrid";
import { useFlexGrid } from "@/presentation/hooks/useFlexGrid";
import { Button } from "@/presentation/components/Button";
import { FetchCustomerService } from "@/application/useCases/customer/fetchCustomerService";
import { CustomerRepository } from "@/infrastructure/customer/CustomerRepository";
import { ScreenActionTemplate } from "@/presentation/template/ScreenActionTemplate";
import { useScreenActionMode } from "@/presentation/hooks/useScreenActionMode";
import { BulkCustomerService } from "@/application/useCases/customer/BulkCustomerService";
import { BulkCustomerCommand } from "@/application/useCases/customer/BulkCustomerCommand";
import { Customer } from "@/domain/customer/Customer";
import toast, { Toaster } from "react-hot-toast";
import { Accordion } from "@/presentation/components/Accordion";

export default function Page() {
  const { onChangeScreenActionMode, onUpdate } = useScreenActionMode();
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
      const bulkCustomerService = new BulkCustomerService(
        new CustomerRepository()
      );
      const bulkCustomerCommand = selectedItems.map((item) => {
        return new BulkCustomerCommand({
          ...item,
          operation: getOperation(item),
          cookie: getCookie(item),
        });
      });
      try {
        const result = await bulkCustomerService.execute(bulkCustomerCommand);
        applyResults(result);
        if (result.some((r) => r.results.length > 0)) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [prefectureCd, setPrefectureCd] = useState<string | null>(null);
  const {
    register,
    setItemsSource,
    getSelectedItems,
    getOperation,
    getCookie,
    applyResults,
  } = useFlexGrid<Customer>([
    {
      header: "得意先名",
      binding: "name",
      dataType: "string",
    },
    {
      header: "都道府県",
      binding: "prefectureCd",
      dataType: "string",
    },
    {
      header: "住所",
      binding: "address",
      dataType: "string",
    },
    {
      header: "電話番号",
      binding: "phoneNumber",
      dataType: "string",
    },
    {
      header: "FAX番号",
      binding: "faxNumber",
      dataType: "string",
    },
    {
      header: "出荷",
      binding: "isShippingStopped",
      dataType: "boolean",
    },
  ]);
  const onTextChanged = (sender: IComboBox) => {
    setName(sender.text);
  };
  const onPrefectureChanged = (sender: IComboBox) => {
    setPrefectureCd(sender.text);
  };
  const search = async () => {
    setIsLoading(true);
    const fetchCustomerService = new FetchCustomerService(
      new CustomerRepository()
    );
    const results = await fetchCustomerService.execute({
      name,
      prefectureCd,
    });
    setItemsSource(results);
    if (results.length === 0) {
      toast.error("検索結果がありません");
    }
    setIsLoading(false);
  };
  return (
    <ScreenActionTemplate>
      <Toaster />
      <Accordion title="検索条件">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col">
            <label>得意先名</label>
            <ComboBox textChanged={onTextChanged} />
          </div>
          <div className="flex flex-col">
            <label>都道府県</label>
            <ComboBox textChanged={onPrefectureChanged} />
          </div>
          <Button onClick={search}>検索</Button>
        </div>
      </Accordion>
      <Accordion title="検索結果">
        <FlexGrid {...register()} pending={isLoading} />
      </Accordion>
    </ScreenActionTemplate>
  );
}
