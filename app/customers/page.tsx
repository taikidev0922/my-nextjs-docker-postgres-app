"use client";
import React from "react";
import { ListScreenTemplate } from "@/presentation/template/ListScreenTemplate";
import { FetchCustomerService } from "@/application/useCases/customer/fetchCustomerService";
import { CustomerRepository } from "@/infrastructure/customer/CustomerRepository";
import { BulkCustomerService } from "@/application/useCases/customer/BulkCustomerService";
import { Customer } from "@/domain/customer/Customer";
import { BulkCustomerCommand } from "@/application/useCases/customer/BulkCustomerCommand";
import { BulkRequest } from "@/domain/common/BulkRequest";
import { ICustomerQuery } from "@/domain/customer/ICustomerQuery";
import { SearchField } from "@/presentation/template/ListScreenTemplate";
import { CustomColumn } from "@/presentation/hooks/useFlexGrid";

const customerRepository = new CustomerRepository();
const fetchCustomerService = new FetchCustomerService(customerRepository);
const bulkCustomerService = new BulkCustomerService(customerRepository);

const searchFields: SearchField[] = [
  { label: "得意先名", key: "name", type: "text" },
  { label: "都道府県", key: "prefectureCd", type: "text" },
  { label: "住所", key: "address", type: "text" },
  { label: "電話番号", key: "phoneNumber", type: "text" },
  { label: "FAX番号", key: "faxNumber", type: "text" },
  {
    label: "出荷",
    key: "isShippingStopped",
    type: "select",
    options: ["全て", "出荷", "出荷停止"],
  },
];

const columns: CustomColumn[] = [
  { header: "得意先名", binding: "name", dataType: "string" },
  { header: "都道府県", binding: "prefectureCd", dataType: "string" },
  { header: "住所", binding: "address", dataType: "string" },
  { header: "電話番号", binding: "phoneNumber", dataType: "string" },
  { header: "FAX番号", binding: "faxNumber", dataType: "string" },
  { header: "出荷", binding: "isShippingStopped", dataType: "boolean" },
];

export default function Page() {
  const fetchCustomers = (params: ICustomerQuery) =>
    fetchCustomerService.execute(params);
  const bulkUpdateCustomers = (items: (Customer & BulkRequest)[]) =>
    bulkCustomerService.execute(
      items.map((item) => new BulkCustomerCommand(item))
    );
  return (
    <ListScreenTemplate<Customer, ICustomerQuery>
      searchFields={searchFields}
      columns={columns}
      fetchService={fetchCustomers}
      bulkUpdateService={bulkUpdateCustomers}
    />
  );
}
