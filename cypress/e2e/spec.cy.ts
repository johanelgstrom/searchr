import cypress from "cypress";

describe("all tests", () => {
  it("should be able to login", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login-btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#username").type("test");
    cy.get("#password").type("test");
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
  });
  it("should be able to log out", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login-btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#username").type("test");
    cy.get("#password").type("test");
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get("#burger-container").click();
    cy.get("h2").should("contain.html", "Hello test");
    cy.get("#logout-btn").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
  it("should be able to post a search", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login-btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#username").type("test");
    cy.get("#password").type("test");
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get("#create-btn").click();
    cy.url().should("eq", "http://localhost:3000/create-post");
    cy.get("#title").type("test title");
    cy.get("#description").type("test description");
    cy.get("#category").select("Animals");
    cy.get("input[type=file]").selectFile("cypress/fixtures/image.jpg");
    cy.get("#submit-btn").click();
    cy.url().should("contain", "post");
    cy.get("#title").should("contain.html", "test title");
    cy.get("#description").should("contain.html", "test description");
    cy.get("#category").should("contain.html", "Animal");
  });
  it("should be able to set a search as found", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login-btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#username").type("test");
    cy.get("#password").type("test");
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get("#create-btn").click();
    cy.url().should("eq", "http://localhost:3000/create-post");
    cy.get("#title").type("test title");
    cy.get("#description").type("test description");
    cy.get("#category").select("Animals");
    cy.get("input[type=file]").selectFile("cypress/fixtures/image.jpg");
    cy.get("#submit-btn").click();
    cy.url().should("contain", "post");
    cy.get("#title").should("contain.html", "test title");
    cy.get("#description").should("contain.html", "test description");
    cy.get("#category").should("contain.html", "Animal");
    cy.get("#found-btn").click();
    cy.get("#found-li").should("contain.html", "Found");
  });
  it("should be able to delete a search", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login-btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#username").type("test");
    cy.get("#password").type("test");
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get("#create-btn").click();
    cy.url().should("eq", "http://localhost:3000/create-post");
    cy.get("#title").type("test title");
    cy.get("#description").type("test description");
    cy.get("#category").select("Animals");
    cy.get("input[type=file]").selectFile("cypress/fixtures/image.jpg");
    cy.get("#submit-btn").click();
    cy.url().should("contain", "post");
    cy.get("#title").should("contain.html", "test title");
    cy.get("#description").should("contain.html", "test description");
    cy.get("#category").should("contain.html", "Animal");
    cy.get("#delete-btn").click();
    cy.get("#confirm-delete-btn").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
  });
  it("should be able to edit a search, then delete", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login-btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#username").type("test");
    cy.get("#password").type("test");
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get("#create-btn").click();
    cy.url().should("eq", "http://localhost:3000/create-post");
    cy.get("#title").type("test title");
    cy.get("#description").type("test description");
    cy.get("#category").select("Animals");
    cy.get("input[type=file]").selectFile("cypress/fixtures/image.jpg");
    cy.get("#submit-btn").click();
    cy.url().should("contain", "post");
    cy.get("#title").should("contain.html", "test title");
    cy.get("#description").should("contain.html", "test description");
    cy.get("#category").should("contain.html", "Animal");

    cy.get("#edit-btn").click();
    cy.get("#title-input").clear().type("test title edited");
    cy.get("#description-input").clear().type("test description edited");
    cy.get("#category-select").select("Objects");
    cy.get("#edit-btn").click();
    cy.get("#title").should("contain.html", "test title edited");
    cy.get("#description").should("contain.html", "test description edited");
    cy.get("#category").should("contain.html", "object");

    cy.get("#delete-btn").click();
    cy.get("#confirm-delete-btn").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
  });
  it("should be able to join a search", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login-btn").click();
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#username").type("test");
    cy.get("#password").type("test");
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get("#create-btn").click();
    cy.url().should("eq", "http://localhost:3000/create-post");
    cy.get("#title").type("test title");
    cy.get("#description").type("test description");
    cy.get("#category").select("Animals");
    cy.get("input[type=file]").selectFile("cypress/fixtures/image.jpg");
    cy.get("#submit-btn").click();
    cy.url().should("contain", "post");
    cy.get("#title").should("contain.html", "test title");
    cy.get("#description").should("contain.html", "test description");
    cy.get("#category").should("contain.html", "Animal");
    cy.get("#join-btn").click();
    cy.url().should("contain", "join");
    cy.wait(16000);
    cy.get("#stop-search-btn").click();
    cy.get("#heading").should("contain.html", "Great job");
    cy.wait(4000);
    cy.url().should("contain", "post");
  });
});
