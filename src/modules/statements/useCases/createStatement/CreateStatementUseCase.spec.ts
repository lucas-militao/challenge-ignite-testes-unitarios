import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { AppError } from "@shared/errors/AppError";

import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);


  });

  it("should be able to make a deposit", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234"
    };

    const { id } = await createUserUseCase.execute(user);

    authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statement: ICreateStatementDTO = {
      amount: 1000,
      description: "salário",
      type: OperationType.DEPOSIT,
      user_id: id!
    }

    const operationResult = await createStatementUseCase.execute(statement);

    expect(operationResult).toHaveProperty("id");
  });

  it("should be able to make a withdraw", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234"
    };

    const { id } = await createUserUseCase.execute(user);

    authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const deposit: ICreateStatementDTO = {
      amount: 1000,
      description: "salário",
      type: OperationType.DEPOSIT,
      user_id: id!
    }

    const withdraw: ICreateStatementDTO = {
      amount: 300,
      description: "gás",
      type: OperationType.WITHDRAW,
      user_id: id!
    }

    await createStatementUseCase.execute(deposit);
    const operationResult = await createStatementUseCase.execute(withdraw);

    expect(operationResult).toHaveProperty("id");
  });

  it("should not be able to make a withdraw with insufficient funds", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234"
    };

    const { id } = await createUserUseCase.execute(user);

    authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const withdraw: ICreateStatementDTO = {
      amount: 300,
      description: "gás",
      type: OperationType.WITHDRAW,
      user_id: id!
    }

    expect(async () => {
      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to make an operation for a not existing user", async () => {
    const deposit: ICreateStatementDTO = {
      amount: 300,
      description: "salário",
      type: OperationType.DEPOSIT,
      user_id: "12345"
    }

    expect(async () => {
      await createStatementUseCase.execute(deposit);
    }).rejects.toBeInstanceOf(AppError);
  });
})
