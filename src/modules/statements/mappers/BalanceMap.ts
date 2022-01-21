import { Statement } from "../entities/Statement";

interface ITransferResponse {
  id: string,
  sender_id: string,
  amount: number,
  description: string,
  type: string,
  created_at: Date,
  updated_at: Date
}

export class BalanceMap {
  static toDTO({statement, transfer, balance}: { statement: Statement[], transfer: ITransferResponse[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    const parsedTransfer = transfer.map(({
      id,
      sender_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => ({
      id,
      sender_id,
      amount: Number(amount),
      description,
      type,
      created_at,
      updated_at
    }))

    return {
      statement: parsedStatement,
      transfer: parsedTransfer,
      balance: Number(balance),
    }
  }
}
