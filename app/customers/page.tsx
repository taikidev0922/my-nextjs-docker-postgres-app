"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ICustomerQuery } from "@/domain/customer/ICustomerQuery";
import { FetchCustomers } from "@/application/useCases/customer/fetchCustomers";
import { CustomerRepository } from "@/infrastructure/customer/CustomerRepository";
import { Customer } from "@/domain/customer/Customer";
import { FlexGrid } from "@mescius/wijmo.react.grid";
import { Accordion } from "@/presentation/components/Accordion";
import {
  useScreenActionMode,
  ScreenActionMode,
} from "@/presentation/hooks/useScreenActionMode"; // パスは実際の構造に合わせて調整してください

const schema = yup
  .object({
    prefectureCd: yup.string().nullable(),
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { screenActionMode } = useScreenActionMode();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICustomerQuery>({
    resolver: yupResolver(schema),
  });

  const columns = [
    { header: "ID", binding: "id", width: 110 },
    { header: "名前", binding: "name", width: 250 },
    { header: "都道府県", binding: "prefectureCd", width: 120 },
    { header: "住所", binding: "address", width: 300 },
    { header: "電話番号", binding: "phoneNumber", width: 150 },
    { header: "FAX番号", binding: "faxNumber", width: 150 },
    { header: "出荷停止", binding: "isShippingStopped", width: 100 },
  ];

  const fetchCustomers = async (query: ICustomerQuery = {}) => {
    const fetchCustomers = new FetchCustomers(new CustomerRepository());
    const data = await fetchCustomers.execute(query);
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onSubmit = (data: ICustomerQuery) => {
    fetchCustomers(data);
  };

  const isReadOnly = screenActionMode === ScreenActionMode.ReadOnly;

  return (
    <div className="min-h-screen">
      <Accordion title="検索項目">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="prefectureCd"
                className="block mb-2 font-medium text-gray-700"
              >
                都道府県
              </label>
              <input
                {...register("prefectureCd")}
                id="prefectureCd"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.prefectureCd && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.prefectureCd.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="isShippingStopped"
                className="block mb-2 font-medium text-gray-700"
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
              {errors.isShippingStopped && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.isShippingStopped.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              検索
            </button>
          </div>
        </form>
      </Accordion>

      <Accordion title="検索結果">
        <div className="overflow-x-auto">
          <FlexGrid
            itemsSource={customers}
            columns={columns}
            style={{ height: 600 }}
            isReadOnly={isReadOnly}
          />
        </div>
        <button
          type="button"
          className={`px-6 py-2 rounded-md mt-4 transition-colors duration-200 ${
            isReadOnly
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          disabled={isReadOnly}
        >
          更新
        </button>
      </Accordion>
    </div>
  );
}
