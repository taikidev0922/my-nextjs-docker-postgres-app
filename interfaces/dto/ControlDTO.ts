export interface ControlDTO {
  id: number;
  controlCd: string;
  controlName: string;
  details: ControlDetailDTO[];
}

export interface ControlDetailDTO {
  id: number;
  cd: string;
  name: string;
}
