import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";


import { GetBalanceError } from "./GetBalanceError";

interface IRequest {
  user_id: string;
}

interface ITransferResponse {
  id: string,
	sender_id: string,
  amount: number,
  description: string,
  type: OperationType,
  created_at: Date,
  updated_at: Date
}

interface IResponse {
  statement: Statement[];
  transfer: ITransferResponse[];
  balance: number;
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new GetBalanceError();
    }

    const balance = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true
    });

    const transfers = (balance as IResponse).statement.filter(statement => statement.type === OperationType.TRANSFER);

    console.log(transfers[0]);

    return balance as IResponse;
  }
}
