const factory = require("../factories");
const { ManifestationDAO } = require("../../manifestation/dao");

describe("manifestation ", () => {
  it("can be created correctly", async () => {
    const manifestation = await factory.build("manifestation");
    await expect(ManifestationDAO.createNew(manifestation)).to.be.fulfilled;
    await expect(ManifestationDAO.getById(manifestation._id)).to.eventually.include({
      name: manifestation.name,
    });
  });

  it("will throw if creation body is invalid", async () => {
    const invalidManifestation = await factory.build("manifestation", { name: null });
    await expect(ManifestationDAO.createNew(invalidManifestation)).to.be.rejectedWith(
      "Manifestation validation failed",
    );
    await expect(ManifestationDAO.getById(invalidManifestation._id)).to.eventually.equal(null);
  });

  it("will return every document", async () => {
    const manifestations = await factory.createMany("manifestation", 10);
    await expect(ManifestationDAO.getAll({}))
      .to.eventually.be.an("object")
      .that.has.property("list")
      .which.has.lengthOf(manifestations.length);
  });
});
