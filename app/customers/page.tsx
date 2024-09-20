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

export default function Page() {
  const { onChangeScreenActionMode, onUpdate } = useScreenActionMode();
  useEffect(() => {
    onChangeScreenActionMode((prevMode, newMode) => {
      console.log(prevMode, newMode);
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
      const result = await bulkCustomerService.execute(bulkCustomerCommand);
      applyResults(result);
      toast.success("更新しました");
    });
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState<string | null>(null);
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
    },
    {
      header: "都道府県",
      binding: "prefectureCd",
    },
    {
      header: "住所",
      binding: "address",
    },
    {
      header: "電話番号",
      binding: "phoneNumber",
    },
    {
      header: "FAX番号",
      binding: "faxNumber",
    },
    {
      header: "出荷",
      binding: "isShippingStopped",
    },
  ]);
  const onTextChanged = (sender: IComboBox) => {
    setName(sender.text);
  };
  const search = async () => {
    setIsLoading(true);
    const fetchCustomerService = new FetchCustomerService(
      new CustomerRepository()
    );
    const results = await fetchCustomerService.execute({ name });
    setItemsSource(results);
    setIsLoading(false);
  };
  return (
    <ScreenActionTemplate>
      <Toaster />
      <div>
        <ComboBox textChanged={onTextChanged} />
        <Button onClick={search}>検索</Button>
      </div>
      <div>
        <FlexGrid {...register()} pending={isLoading} />
      </div>
    </ScreenActionTemplate>
  );
}
