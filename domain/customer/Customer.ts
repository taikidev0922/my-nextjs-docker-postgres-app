export class Customer {
  constructor(
    public id: number,
    public name: string,
    public prefectureCd: string,
    public address: string,
    public phoneNumber: string,
    public faxNumber?: string,
    public isShippingStopped: boolean = false
  ) {}
}
