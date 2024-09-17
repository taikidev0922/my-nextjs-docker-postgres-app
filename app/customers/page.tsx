"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ICustomerQuery } from "@/domain/customer/ICustomerQuery";
import { FetchCustomers } from "@/application/useCases/customer/fetchCustomers";
import { CustomerRepository } from "@/infrastructure/customer/CustomerRepository";
import { Customer } from "@/domain/customer/Customer";
import { Accordion } from "@/presentation/components/Accordion";
import { ScreenActionTemplate } from "@/presentation/template/ScreenActionTemplate";
import { useScreenActionMode } from "@/presentation/hooks/useScreenActionMode";
import { FlexGrid } from "@/presentation/components/FlexGrid";
import { Button } from "@/presentation/components/Button";
import TextField from "@/presentation/components/TextField";
import ComboBox from "@/presentation/components/ComboBox";

const schema = yup.object({
  name: yup.string().nullable(),
  prefectureCd: yup.string().nullable(),
  address: yup.string().nullable(),
  phoneNumber: yup.string().nullable(),
  faxNumber: yup.string().nullable(),
  isShippingStopped: yup.boolean().nullable(),
});

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { screenActionMode } = useScreenActionMode();
  const [isPending, setIsPending] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ICustomerQuery>({
    resolver: yupResolver(schema),
  });

  const columns = [
    { header: "名前", binding: "name" },
    { header: "都道府県", binding: "prefectureCd" },
    { header: "住所", binding: "address" },
    { header: "電話番号", binding: "phoneNumber" },
    { header: "FAX番号", binding: "faxNumber" },
    { header: "出荷停止", binding: "isShippingStopped" },
  ];

  const fetchCustomers = useCallback(async (query: ICustomerQuery = {}) => {
    setIsPending(true);
    try {
      const fetchCustomers = new FetchCustomers(new CustomerRepository());
      const data = await fetchCustomers.execute(query);
      setCustomers(data);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setCustomers([]);
  }, [screenActionMode]);

  const onSubmit = (data: ICustomerQuery) => {
    fetchCustomers(data);
  };

  return (
    <ScreenActionTemplate>
      <Accordion title="検索項目">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4" noValidate>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <TextField label="得意先名" name="name" control={control} />
            <TextField label="都道府県" name="prefectureCd" control={control} />
            <TextField label="住所" name="address" control={control} />
            <TextField label="電話番号" name="phoneNumber" control={control} />
            <TextField label="FAX番号" name="faxNumber" control={control} />
            <ComboBox
              label="出荷停止"
              name="isShippingStopped"
              control={control}
              itemsSource={[
                { label: "全て", value: undefined },
                { label: "停止中", value: true },
                { label: "出荷可", value: false },
              ]}
            />
          </div>
          <div>{errors.isShippingStopped?.message}</div>
          <div className="mt-6 flex justify-center">
            <Button type="submit" pending={isPending}>
              検索
            </Button>
          </div>
        </form>
      </Accordion>

      <Accordion title="検索結果">
        <FlexGrid<Customer>
          columns={columns}
          itemsSource={customers}
          pending={isPending}
        />
      </Accordion>
    </ScreenActionTemplate>
  );
}
