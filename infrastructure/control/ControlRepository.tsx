import { IControlRepository } from "../../domain/control/IControlRepository";
import { ControlDTO } from "@/interfaces/dto/ControlDTO";

export class ControlRepository implements IControlRepository {
  async findAll(): Promise<ControlDTO[]> {
    try {
      const response = await fetch(`/api/controls`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ControlDTO[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching control details:", error);
      throw error;
    }
  }
}
