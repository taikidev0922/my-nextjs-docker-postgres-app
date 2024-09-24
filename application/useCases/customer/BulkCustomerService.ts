import { ICustomerRepository } from "@/domain/customer/ICustomerRepository";
import { BulkCustomerCommand } from "./BulkCustomerCommand";
import { Customer } from "@/domain/customer/Customer";
import { BulkResult } from "@/domain/common/BulkResult";
export class BulkCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(
    selectedItems: BulkCustomerCommand[]
  ): Promise<(Customer & BulkResult)[]> {
    return await this.customerRepository.bulkUpdate(selectedItems);
  }
}
