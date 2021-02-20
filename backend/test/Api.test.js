require("dotenv").config();
const request = require("supertest");
const { Routing } = require("../routes");
const { dbconn } = require("../dbUtils");

describe("Test the root path", () => {
  test("It should response the GET method", (done) =>
    request(Routing())
      .get("/api/losses")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        dbconn.close();
        done();
      }));
});
