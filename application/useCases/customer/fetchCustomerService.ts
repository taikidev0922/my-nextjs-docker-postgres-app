import { ICustomerRepository } from "../../../domain/customer/ICustomerRepository";
import { Customer } from "../../../domain/customer/Customer";
import { ICustomerQuery } from "../../../domain/customer/ICustomerQuery";

export class FetchCustomerService {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(query: ICustomerQuery): Promise<Customer[]> {
    return this.customerRepository.findAll(query);
  }
}
