import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer_operation = await createTransferUseCase.handle({
      amount,
      description,
      sender_id: id,
      receiver_id: user_id
    });

    return response.json(transfer_operation);
  }
}

export { CreateTransferController };
