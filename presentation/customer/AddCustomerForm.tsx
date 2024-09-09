"use client";

import React, { useState } from "react";

type CustomerFormData = {
  name: string;
  prefecture: string;
  address: string;
  phoneNumber: string;
  faxNumber: string;
  isShippingStopped: boolean;
};

type AddCustomerFormProps = {
  onCustomerAdded: () => void;
};

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  onCustomerAdded,
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    prefecture: "",
    address: "",
    phoneNumber: "",
    faxNumber: "",
    isShippingStopped: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          prefecture: "",
          address: "",
          phoneNumber: "",
          faxNumber: "",
          isShippingStopped: false,
        });
        onCustomerAdded();
        alert("得意先が追加されました");
      } else {
        alert("得意先の追加に失敗しました");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("エラーが発生しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">
          名前:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="prefecture" className="block">
          都道府県:
        </label>
        <input
          type="text"
          id="prefecture"
          name="prefecture"
          value={formData.prefecture}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="address" className="block">
          住所:
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block">
          電話番号:
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="faxNumber" className="block">
          FAX:
        </label>
        <input
          type="tel"
          id="faxNumber"
          name="faxNumber"
          value={formData.faxNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isShippingStopped"
            checked={formData.isShippingStopped}
            onChange={handleChange}
            className="mr-2"
          />
          出荷停止
        </label>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        追加
      </button>
    </form>
  );
};

export default AddCustomerForm;
