export class BulkCustomerCommand {
  cookie: number;
  id?: number;
  name?: string;
  prefectureCd?: string;
  address: string;
  phoneNumber: string;
  faxNumber?: string;
  isShippingStopped?: boolean;
  operation: "save" | "delete";

  constructor(data: {
    cookie: number;
    id?: number;
    name?: string;
    prefectureCd?: string;
    address: string;
    phoneNumber: string;
    faxNumber?: string;
    isShippingStopped?: boolean;
    operation: "save" | "delete";
  }) {
    this.cookie = data.cookie;
    this.id = data.id;
    this.name = data.name;
    this.prefectureCd = data.prefectureCd;
    this.address = data.address;
    this.phoneNumber = data.phoneNumber;
    this.faxNumber = data.faxNumber;
    this.isShippingStopped = data.isShippingStopped;
    this.operation = data.operation;
  }
}
