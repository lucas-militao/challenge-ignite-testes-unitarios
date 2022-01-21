import { Statement } from "@modules/statements/entities/Statement";
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
  type: string,
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
    }) as IResponse;

    let transfers = balance.statement.filter(statement => statement.type === 'transfer');

    let transfersConverted: ITransferResponse[] = [];

    transfers.forEach(t => {
      transfersConverted.push({
        id: t.id!,
        amount: t.amount,
        created_at: t.created_at,
        description: t.description,
        sender_id: t.user_id,
        type: t.type,
        updated_at: t.updated_at
      })
    });

    console.log(transfersConverted);

    let statements = balance.statement.filter(statement => statement.type !== 'transfer');

    return {
      balance: balance.balance,
      statement: statements,
      transfer: transfersConverted
    };
  }
}
