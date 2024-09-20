import { ICustomerRepository } from "@/domain/customer/ICustomerRepository";
import { BulkCustomerCommand } from "./BulkCustomerCommand";
export class BulkCustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  execute(selectedItems: BulkCustomerCommand[]) {
    this.customerRepository.bulkUpdate(selectedItems);
  }
}
