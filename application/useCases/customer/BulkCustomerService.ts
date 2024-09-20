import { ICustomerRepository } from "@/domain/customer/ICustomerRepository";
import { BulkCustomerCommand } from "./BulkCustomerCommand";
import { Customer } from "@/domain/customer/Customer";
export class BulkCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(
    selectedItems: BulkCustomerCommand[]
  ): Promise<(Customer & { cookie: number })[]> {
    return await this.customerRepository.bulkUpdate(selectedItems);
  }
}
