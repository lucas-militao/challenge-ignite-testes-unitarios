import { Transfer } from "../entities/Transfer";

interface ITransfersRepository {
  transfer(amount: number, description: string): Promise<Transfer>
}

export { ITransfersRepository };
