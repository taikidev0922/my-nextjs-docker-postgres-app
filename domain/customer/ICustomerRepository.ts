import { Customer } from "./Customer";
import { ICustomerQuery } from "./ICustomerQuery";

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findAll(query: ICustomerQuery): Promise<Customer[]>;
  bulkUpdate(customers: Customer[]): Promise<void>;
}
