
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      name: "User Test",
      email: "test@email.com",
      password: "1234"
    };

    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty("id");
  })

  it("should not be able to create an existing user", async () => {
    const user: ICreateUserDTO = {
      name: "User Test",
      email: "test@email.com",
      password: "1234"
    };

    await createUserUseCase.execute(user);

    await expect(
      createUserUseCase.execute(user)
    ).rejects.toEqual(new CreateUserError());
  });
});
