import createConnection from "@database/."
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Statement Information", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement information", async () => {
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

    const statementResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "mesada"
      })
      .set({
        Authorization: `Bearer ${token}`,
    });

    const { id: statement_id } = statementResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  })
})
