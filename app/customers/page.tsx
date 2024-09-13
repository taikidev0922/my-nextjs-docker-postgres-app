"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { ComboBox } from "@mescius/wijmo.react.input";

const schema = yup
  .object({
    name: yup.string().nullable(),
    prefectureCd: yup.string().nullable(),
    address: yup.string().nullable(),
    phoneNumber: yup.string().nullable(),
    faxNumber: yup.string().nullable(),
    isShippingStopped: yup
      .boolean()
      .transform((value) => {
        if (value === "") return undefined;
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
      })
      .nullable(),
  })
  .required();

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { onChangeScreenActionMode } = useScreenActionMode();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

  const fetchCustomers = async (query: ICustomerQuery = {}) => {
    const fetchCustomers = new FetchCustomers(new CustomerRepository());
    const data = await fetchCustomers.execute(query);
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();

    onChangeScreenActionMode(() => {
      setCustomers([]);
    });
  }, []);

  const onSubmit = (data: ICustomerQuery) => {
    fetchCustomers(data);
  };

  return (
    <ScreenActionTemplate>
      <Accordion title="検索項目">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4" noValidate>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex flex-col">
              <label htmlFor="name">得意先名</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <ComboBox
                    id="name"
                    textChanged={(sender) => {
                      field.onChange(sender.text);
                    }}
                  />
                )}
              />
            </div>
            <div>
              <label
                htmlFor="prefectureCd"
                className="block mb-1 font-medium text-gray-700"
              >
                都道府県
              </label>
              <input
                {...register("prefectureCd")}
                id="prefectureCd"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-1 font-medium text-gray-700"
              >
                住所
              </label>
              <input
                {...register("address")}
                id="address"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block mb-1 font-medium text-gray-700"
              >
                電話番号
              </label>
              <input
                {...register("phoneNumber")}
                id="phoneNumber"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="faxNumber"
                className="block mb-1 font-medium text-gray-700"
              >
                FAX番号
              </label>
              <input
                {...register("faxNumber")}
                id="faxNumber"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="isShippingStopped"
                className="block mb-1 font-medium text-gray-700"
              >
                出荷停止
              </label>
              <select
                {...register("isShippingStopped")}
                id="isShippingStopped"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全て</option>
                <option value="true">停止中</option>
                <option value="false">出荷可</option>
              </select>
            </div>
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="mt-2 text-sm text-red-500">
              入力内容に誤りがあります。ご確認ください。
            </div>
          )}
          <div className="mt-6 flex justify-center">
            <Button type="submit" className="w-1/2 max-w-md">
              検索
            </Button>
          </div>
        </form>
      </Accordion>

      <Accordion title="検索結果">
        <FlexGrid columns={columns} itemsSource={customers} />
      </Accordion>
    </ScreenActionTemplate>
  );
}
