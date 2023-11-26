import chai from "chai";
import supertest from "supertest";
import app from "../app.js"; // Import your Express app instance
import UserModel from "../models/User.js";
import { runSecurityTests } from './securityTest.js';

const expect = chai.expect;
const request = supertest(app);

describe("UserController Tests", () => {
  let userToken;

  before(async () => {
    // Register a user for testing
    await UserModel.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "testpassword",
      tc: "true",
      role: "user",
    });
  });

  it("should register a new user", async () => {
    const response = await request.post("/api/user/register").send({
      name: "New User",
      email: "newuser@example.com",
      password: "newpassword",
      password_confirmation: "newpassword",
      tc: "true",
      role: "user", // or 'admin' based on your requirements
    });

    runSecurityTests(response);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Registration Success");
    expect(response.body).to.have.property("token");
  });

  it("should not register a user with an existing email", async () => {
    const response = await request.post("/api/user/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      password_confirmation: "password123",
      tc: "true",
      role: "user",
    });

    runSecurityTests(response);
    expect(response.status).to.equal(200); // Assuming you return a status of 200 for this case
    expect(response.body.status).to.equal("failed");
    expect(response.body.message).to.equal("Email already exists");
  });

  it("should log in a user and return a token", async () => {
    const response = await request.post("/api/user/login").send({
      email: "newuser@example.com",
      password: "newpassword",
    });

    runSecurityTests(response);
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Login Success");
    expect(response.body).to.have.property("token");
    userToken = response.body.token;
    console.log(userToken);
  });

  it("should access a protected route with valid authentication", async () => {
    const response = await request
      .get("/api/user/loggeduser")
      .set("Authorization", `Bearer ${userToken}`);
    
      runSecurityTests(response);
      expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(
      "This route is accessible to authenticated users"
    );
    expect(response.body).to.have.property("user");
  });

  it("should not access an admin-only route with a regular user token", async () => {
    const response = await request
      .get("/api/user/admin/dashboard")
      .set("Authorization", `Bearer ${userToken}`);
      runSecurityTests(response);
    expect(response.status).to.equal(403);
    expect(response.body.message).to.equal("Access denied. Admins only.");
  });

});
