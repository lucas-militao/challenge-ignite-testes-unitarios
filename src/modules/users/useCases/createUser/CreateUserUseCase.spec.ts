
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      email: "test@email.com",
      name: "User Test",
      password: "1234"
    };

    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty("id");
  })

  it("should not be able to create an existing user", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "test@email.com",
        name: "User Test",
        password: "1234"
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute({
        email: user.email,
        name: "Another User Test",
        password: "4321"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
