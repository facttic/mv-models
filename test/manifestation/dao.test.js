const dbHandler = require("../db_handler");
const factories = require("../factories");
const { ManifestationDAO } = require("../../manifestation/dao");

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("manifestation ", () => {
  it("can be created correctly", async () => {
    expect(
      async () => await ManifestationDAO.createNew(factories.manifestationFactory()),
    ).not.toThrow();
  });

  it("will throw if the body is invalid", async () => {
    const invalidManifestation = factories.manifestationFactory({ name: { skip: true } });
    await expect(ManifestationDAO.createNew(invalidManifestation)).rejects.toThrow(
      "validation failed",
    );
  });
});
