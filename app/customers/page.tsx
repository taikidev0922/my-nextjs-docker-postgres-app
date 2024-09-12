"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomerList from "@/presentation/customer/CustomerList";
import { ICustomerQuery } from "@/domain/customer/ICustomerQuery";

const schema = yup
  .object({
    prefectureCd: yup.string(),
    isShippingStopped: yup.boolean(),
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
    if (query.prefectureCd) params.append("prefectureCd", query.prefectureCd);
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

  const generateRandomCustomer = () => {
    const prefectures = ["東京都", "大阪府", "愛知県", "北海道", "福岡県"];
    const names = ["株式会社A", "有限会社B", "C商事", "D工業", "Eストア"];

    return {
      name: names[Math.floor(Math.random() * names.length)],
      prefectureCd: prefectures[Math.floor(Math.random() * prefectures.length)],
      address: `${Math.floor(Math.random() * 100)}番地`,
      phoneNumber: `0${Math.floor(Math.random() * 90000000 + 10000000)}`,
      faxNumber:
        Math.random() > 0.5
          ? `0${Math.floor(Math.random() * 90000000 + 10000000)}`
          : undefined,
      isShippingStopped: Math.random() > 0.8,
    };
  };

  const addRandomCustomer = async () => {
    const newCustomer = generateRandomCustomer();
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        fetchCustomers();
      } else {
        console.error("Failed to add random customer");
      }
    } catch (error) {
      console.error("Error adding random customer:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">得意先一覧</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="flex gap-4">
          <div>
            <label htmlFor="prefectureCd" className="block mb-2">
              都道府県
            </label>
            <input
              {...register("prefectureCd")}
              id="prefectureCd"
              type="text"
              className="border rounded px-2 py-1"
            />
            {errors.prefectureCd && (
              <p className="text-red-500 text-sm mt-1">
                {errors.prefectureCd.message}
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

      <button
        onClick={addRandomCustomer}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        ランダムに得意先を追加
      </button>

      <CustomerList customers={customers} />
    </div>
  );
}
