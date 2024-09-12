import { Customer } from "./Customer";
import { ICustomerQuery } from "./ICustomerQuery";

export interface ICustomerRepository {
  findAll(query: ICustomerQuery): Promise<Customer[]>;
  bulkUpdate(customers: Customer[]): Promise<void>;
}
