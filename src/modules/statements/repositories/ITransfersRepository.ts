import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";

interface ITransfersRepository {
  create(receiver_id: string, statement_id: string): Promise<Transfer>
}

export { ITransfersRepository };
