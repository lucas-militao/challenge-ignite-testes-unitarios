import createConnection from "@database/."
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";
import { AppError } from "@shared/errors/AppError";

let connection: Connection;

describe("Create an User", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create an user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Test",
        email: "newuser@test.com.br",
        password: "12345"
      });

    expect(response.status).toBe(201);
  });

  // it("should not be able to create an user with same email", async () => {
  //   expect(async () => {
  //     await request(app)
  //     .post("/api/v1/users")
  //     .send({
  //       name: "User1",
  //       email: "test@test.com.br",
  //       password: "12345"
  //     });

  //     const response = await request(app)
  //     .post("/api/v1/users")
  //     .send({
  //       name: "User2",
  //       email: "test@test.com.br",
  //       password: "12345"
  //     });

  //     console.log(response.body);
  //   }).rejects.toBeInstanceOf(AppError);
  // });
});
