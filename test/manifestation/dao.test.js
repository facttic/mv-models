const dbHandler = require("../db_handler");
const factories = require("../factories");
const { ManifestationDAO } = require("../../manifestation/dao");

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("manifestation ", () => {
  it("can be created correctly", async () => {
    expect(async () => await ManifestationDAO.createNew(validManifestation())).not.toThrow();
  });
});

const validManifestation = (options = {}, values = {}) =>
  factories.manifestationFactory(options).generate(values);
