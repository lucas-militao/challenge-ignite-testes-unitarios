import { OperationType } from "@modules/statements/entities/Statement";
import { Transfer } from "@modules/statements/entities/Transfer";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  async handle({sender_id, receiver_id, description, amount}: ICreateTransferDTO): Promise<Transfer> {
    const user = await this.usersRepository.findById(sender_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    const transferOperation = await this.statementsRepository.transfer({
      sender_id,
      receiver_id,
      amount,
      description,
    });

    return transferOperation;
  }
}

export { CreateTransferUseCase };
