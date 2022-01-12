import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ITransfersRepository } from "./ITransfersRepository";

class TransfersRepository implements ITransfersRepository {
  private repository: Repository<Transfer>

  constructor() {
    this.repository = getRepository(Transfer);
  }

  transfer(amount: number, description: string): Promise<Transfer> {
    throw new Error("Method not implemented.");
  }
}
