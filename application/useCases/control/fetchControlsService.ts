import { IControlRepository } from "../../../domain/control/IControlRepository";
import { Control } from "../../../domain/control/Control";
import { ControlDTO } from "../../../interfaces/dto/ControlDTO";

export class FetchControlsService {
  constructor(private controlRepository: IControlRepository) {}

  async execute(): Promise<Control[]> {
    const controlDTOs = await this.controlRepository.findAll();
    return controlDTOs.map(this.convertToControl);
  }

  private convertToControl(dto: ControlDTO): Control {
    return new Control(dto.id, dto.controlCd, dto.controlName);
  }
}
