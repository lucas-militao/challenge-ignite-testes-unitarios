import { OperationType } from "@modules/statements/entities/Statement";
import { Transfer } from "@modules/statements/entities/Transfer";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { ITransfersRepository } from "@modules/statements/repositories/ITransfersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository
  ) {}

  async handle({ amount, description, receiver_id, sender_id }: ICreateTransferDTO): Promise<void> {
    const user = await this.usersRepository.findById(receiver_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const statement = await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    const transfer = await this.transfersRepository.create(
      receiver_id,
      statement.id!
    );

    await this.statementsRepository.create(
      {
        ...statement,
        transfer_id: transfer.id!
      }
    )
  }
}

export { CreateTransferUseCase };
