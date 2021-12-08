
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { Response } from "express";
import { STATUS_CODES } from "http";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("should create an user", async () => {
    const user: ICreateUserDTO = {
      email: "test@email.com",
      name: "User Test",
      password: "1234"
    };

    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty("id");
  })
});
