import createConnection from "@database/."
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;
let token: string;

describe("Create Statement", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

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

    token = responseToken.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to do a deposit", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "mesada"
      })
      .set({
        Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to do a withdraw", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "compras"
      })
      .set({
        Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to make a withdraw with insufficient funds", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 5000,
        description: "ps5"
      })
      .set({
        Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  })
});
