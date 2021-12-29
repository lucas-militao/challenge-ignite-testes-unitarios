import createConnection from "@database/."
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";
import { AppError } from "@shared/errors/AppError";

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Test",
        email: "test@test.com.br",
        password: "12345"
    });

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "test@test.com.br",
        password: "12345"
    });

    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate a non existing user ", async () => {

      const response = await request(app)
        .post("/api/v1/sessions")
        .send({
          email: "error@test.com.br",
          password: "12345"
      });

      expect(response.status).toBe(401);
  });
});
