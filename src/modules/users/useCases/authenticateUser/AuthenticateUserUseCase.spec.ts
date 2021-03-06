import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("User Authentication", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const userResponse = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(userResponse).toHaveProperty("token");
  });

  it("should not be able to authenticate user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect password",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be able to authenticate user with incorrect email", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com.br",
      name: "User Test",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: "wrong@email.com.br",
        password: user.password,
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

});
