import { ControlDTO } from "@/interfaces/dto/ControlDTO";

export interface IControlRepository {
  findAll(): Promise<ControlDTO[]>;
}
