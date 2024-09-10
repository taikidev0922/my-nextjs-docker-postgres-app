import React from "react";

type Customer = {
  id: number;
  name: string;
  prefectureCd: string;
  address: string;
  phoneNumber: string;
  faxNumber: string | null;
  isShippingStopped: boolean;
};

type CustomerListProps = {
  customers: Customer[];
};

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">名前</th>
            <th className="py-2 px-4 border">都道府県</th>
            <th className="py-2 px-4 border">住所</th>
            <th className="py-2 px-4 border">電話番号</th>
            <th className="py-2 px-4 border">FAX</th>
            <th className="py-2 px-4 border">出荷停止</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border">{customer.id}</td>
              <td className="py-2 px-4 border">{customer.name}</td>
              <td className="py-2 px-4 border">{customer.prefectureCd}</td>
              <td className="py-2 px-4 border">{customer.address}</td>
              <td className="py-2 px-4 border">{customer.phoneNumber}</td>
              <td className="py-2 px-4 border">{customer.faxNumber || "-"}</td>
              <td className="py-2 px-4 border">
                {customer.isShippingStopped ? "停止中" : "出荷可"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
