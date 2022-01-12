import { Transfer } from "@modules/statements/entities/Transfer"

export interface ICreateTransferDTO {
  sender_id: string,
  receiver_id: string,
  description: string,
  amount: number,
}
