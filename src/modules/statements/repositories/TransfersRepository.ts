import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { ITransfersRepository } from "./ITransfersRepository";

class TransfersRepository implements ITransfersRepository{
  private repository: Repository<Transfer>

  constructor() {
    this.repository = getRepository(Transfer);
  }

  async create(receiver_id: string, statement_id: string): Promise<Transfer> {
    const transference = this.repository.create({
      receiver_id,
      statement_id
    });

    await this.repository.save(transference);

    return transference;
  }
}

export { TransfersRepository };
