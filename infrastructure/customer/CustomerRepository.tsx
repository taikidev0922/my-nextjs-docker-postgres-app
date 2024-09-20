import { Customer } from "../../domain/customer/Customer";
import { ICustomerQuery } from "../../domain/customer/ICustomerQuery";
import { ICustomerRepository } from "../../domain/customer/ICustomerRepository";
import { QueryBuilder } from "@/infrastructure/utils/QueryBuilder";
import { BulkCustomerCommand } from "@/application/useCases/customer/BulkCustomerCommand";

export class CustomerRepository implements ICustomerRepository {
  async findAll(query: ICustomerQuery): Promise<Customer[]> {
    try {
      const queryBuilder = new QueryBuilder<ICustomerQuery>(query);
      const queryString = queryBuilder.toString();

      const response = await fetch(`/api/customers?${queryString}`);

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

  async bulkUpdate(customers: BulkCustomerCommand[]): Promise<void> {
    try {
      const response = await fetch("/api/customers", {
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
