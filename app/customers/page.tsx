"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomerList from "@/presentation/customer/CustomerList";

export interface ICustomerQuery {
  prefecture?: string;
  isShippingStopped?: boolean;
}

const schema = yup
  .object({
    prefecture: yup.string().max(20, "都道府県は20文字以内で入力してください"),
    isShippingStopped: yup
      .boolean()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
  })
  .required();

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICustomerQuery>({
    resolver: yupResolver(schema),
  });

  const fetchCustomers = async (query: ICustomerQuery = {}) => {
    const params = new URLSearchParams();
    if (query.prefecture) params.append("prefecture", query.prefecture);
    if (
      query.isShippingStopped !== undefined &&
      query.isShippingStopped !== null
    )
      params.append("isShippingStopped", query.isShippingStopped.toString());

    const response = await fetch(`/api/customers?${params.toString()}`);
    const data = await response.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onSubmit = (data: ICustomerQuery) => {
    fetchCustomers(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">得意先一覧</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="flex gap-4">
          <div>
            <label htmlFor="prefecture" className="block mb-2">
              都道府県
            </label>
            <input
              {...register("prefecture")}
              id="prefecture"
              type="text"
              className="border rounded px-2 py-1"
            />
            {errors.prefecture && (
              <p className="text-red-500 text-sm mt-1">
                {errors.prefecture.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="isShippingStopped" className="block mb-2">
              出荷停止
            </label>
            <select
              {...register("isShippingStopped")}
              id="isShippingStopped"
              className="border rounded px-2 py-1"
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
          <div className="self-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              検索
            </button>
          </div>
        </div>
      </form>

      <CustomerList customers={customers} />
    </div>
  );
}
