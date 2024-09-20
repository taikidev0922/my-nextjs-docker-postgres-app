import { Customer } from "./Customer";
import { ICustomerQuery } from "./ICustomerQuery";
import { BulkCustomerCommand } from "@/application/useCases/customer/BulkCustomerCommand";
export interface ICustomerRepository {
  findAll(query: ICustomerQuery): Promise<Customer[]>;
  bulkUpdate(customers: BulkCustomerCommand[]): Promise<void>;
}
