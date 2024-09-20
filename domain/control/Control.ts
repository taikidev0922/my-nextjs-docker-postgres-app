export class ControlDetail {
  constructor(public id: number, public cd: string, public name: string) {}
}

export class Control {
  constructor(
    public id: number,
    public controlCd: string,
    public controlName: string,
    public details: ControlDetail[]
  ) {}

  addDetail(detail: ControlDetail) {
    this.details.push(detail);
  }

  removeDetail(detailId: number) {
    this.details = this.details.filter((detail) => detail.id !== detailId);
  }

  updateDetail(updatedDetail: ControlDetail) {
    const index = this.details.findIndex(
      (detail) => detail.id === updatedDetail.id
    );
    if (index !== -1) {
      this.details[index] = updatedDetail;
    }
  }

  getDetailById(detailId: number): ControlDetail | undefined {
    return this.details.find((detail) => detail.id === detailId);
  }
}
