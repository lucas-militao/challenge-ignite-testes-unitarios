import createConnection from "@database/."
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to do a deposit", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Test",
        email: "usertest@test.com.br",
        password: "12345"
    });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "usertest@test.com.br",
        password: "12345"
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: "100",
        description: "mesada"
      })
      .set({
        Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
});
