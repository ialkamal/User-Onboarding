describe("Form Test", function () {
  it("Check Form Fields", function () {
    //Don't forget to select the correct port
    cy.visit("localhost:3000");

    cy.get("input[name=name]")
      .type("Basel Taher")
      .should("have.value", "Basel Taher");

    cy.get("input[name=name]").should("have.not.value", "");

    cy.get("input[name=name]").type(" ");

    cy.get("select[name=role]")
      .select("Designer")
      .should("have.value", "Designer");

    cy.get("input[name=email]")
      .type("basel@nawatt.com")
      .should("have.value", "basel@nawatt.com");

    cy.get("input[name=email]").should("have.not.value", "");

    cy.get("input[name=male]").check().should("be.checked");

    cy.get("input[name=password]")
      .type("ilovelambdaschool")
      .should("have.value", "ilovelambdaschool");

    cy.get("input[name=password]").should("have.not.value", "");

    cy.get("input[name=checkbox]").check().should("be.checked");

    cy.get("button").should("not.be.disabled").click();
  });
});
