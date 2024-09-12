import { Customer } from "../../domain/customer/Customer";
import { ICustomerQuery } from "../../domain/customer/ICustomerQuery";
import { ICustomerRepository } from "../../domain/customer/ICustomerRepository";

export class CustomerRepository implements ICustomerRepository {
  async findAll(query: ICustomerQuery): Promise<Customer[]> {
    try {
      const params = new URLSearchParams();
      if (query.prefectureCd) params.append("prefectureCd", query.prefectureCd);
      if (
        query.isShippingStopped !== undefined &&
        query.isShippingStopped !== null
      ) {
        params.append("isShippingStopped", query.isShippingStopped.toString());
      }

      const response = await fetch(`/api/customers?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }

  async bulkUpdate(customers: Customer[]): Promise<void> {
    try {
      const response = await fetch("/api/customers/bulk-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customers),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error bulk updating customers:", error);
      throw error;
    }
  }
}
