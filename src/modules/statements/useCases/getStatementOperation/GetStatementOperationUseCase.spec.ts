import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperation: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
    getStatementOperation = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should be able to get statement operation information", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234"
    };

    const { id } = await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statement: ICreateStatementDTO = {
      amount: 1000,
      description: "salário",
      type: OperationType.DEPOSIT,
      user_id: id!
    }

    const operation = await createStatementUseCase.execute(statement);

    const result = await getStatementOperation.execute({
      user_id: id!,
      statement_id: operation.id!
    });

    expect(result).toHaveProperty("id");
  })

  it("should not be able to get a statement from a non existing user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234"
    };

    const { id } = await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statement: ICreateStatementDTO = {
      amount: 1000,
      description: "salário",
      type: OperationType.DEPOSIT,
      user_id: id!
    }

    const operation = await createStatementUseCase.execute(statement);

    expect(async () => {
      await getStatementOperation.execute({
        user_id: "123456",
        statement_id: operation.id!
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
