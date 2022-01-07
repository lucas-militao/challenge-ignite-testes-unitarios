import createConnection from "@database/."
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Get balance", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user balance", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Test",
        email: "test@email.com.br",
        password: "12345"
    });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "test@email.com.br",
        password: "12345"
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
  })
})
