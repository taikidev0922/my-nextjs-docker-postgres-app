"use client";

import { useState, useEffect } from "react";
import CustomerList from "@/presentation/customer/CustomerList";
import AddCustomerForm from "@/presentation/customer/AddCustomerForm";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const response = await fetch("/api/customers");
    const data = await response.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">得意先一覧</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">新規得意先追加</h2>
        <AddCustomerForm onCustomerAdded={fetchCustomers} />
      </div>
      <CustomerList customers={customers} />
    </div>
  );
}
