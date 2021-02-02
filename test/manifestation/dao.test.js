const factory = require("../factories");
const { ManifestationDAO } = require("../../manifestation/dao");
const { Types } = require("mongoose");

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
    const manifestations = await factory.createMany("manifestation", 15);
    await expect(ManifestationDAO.getAll({}))
      .to.eventually.be.an("object")
      .that.has.property("list")
      .which.has.lengthOf(manifestations.length);
  });

  it("will return an empty list if there are no documents", async () => {
    await expect(ManifestationDAO.getAll({}))
      .to.eventually.be.an("object")
      .that.has.property("list")
      .which.has.lengthOf(0);
  });

  it("will retrieve a manifestation by id", async () => {
    const manifestation = await factory.create("manifestation");
    await expect(ManifestationDAO.getById(manifestation._id))
      .to.eventually.be.an("object")
      .that.has.property("name")
      .which.equals(manifestation.name);
  });

  it("will return null when attempting to find an unexistent manifestation by id", async () => {
    const objectId = new Types.ObjectId();
    await expect(ManifestationDAO.getById(objectId)).to.eventually.equal(null);
  });

  it("will update a manifestation by id and return the updated object", async () => {
    const manifestation = await factory.create("manifestation");
    const validManifestation = await factory.build("manifestation");

    // mongoose instance comes with an _id
    delete validManifestation._doc._id;

    await expect(ManifestationDAO.udpate(manifestation._id, validManifestation))
      .to.eventually.be.an("object")
      .that.has.property("name")
      .which.equals(validManifestation.name);
  });

  it("will throw if update body is invalid", async () => {
    const manifestation = await factory.create("manifestation");
    const invalidManifestation = await factory.build("manifestation", { name: null });

    delete invalidManifestation._doc._id;

    await expect(
      ManifestationDAO.udpate(manifestation._id, invalidManifestation),
    ).to.be.rejectedWith("Validation failed");
  });

  it("will delete a document by id", async () => {
    const manifestation = await factory.create("manifestation");

    await expect(ManifestationDAO.removeById(manifestation._id)).to.be.fulfilled;
    await expect(ManifestationDAO.getById(manifestation._id)).to.eventually.equal(null);
  });

  it("will update people count according to different scenarios", async () => {
    const manifestation = await factory.create("manifestation");

    // expect 0 if no posts
    await expect(manifestation.updatePeopleCount())
      .to.eventually.be.an("object")
      .that.has.property("people")
      .which.is.equals(0);

    // insert many posts created by only two users
    await factory.createMany("post", 6, {
      "user.id_str": "12345",
      manifestation_id: manifestation._id,
    });
    await factory.createMany("post", 8, {
      "user.id_str": "67890",
      manifestation_id: manifestation._id,
    });

    // expect those 2 accordingly
    await expect(manifestation.updatePeopleCount())
      .to.eventually.be.an("object")
      .that.has.property("people")
      .which.is.equals(2);

    // add an extra user and expect one more
    await factory.createMany("post", 5, {
      "user.id_str": "12390",
      manifestation_id: manifestation._id,
    });

    // and expect one more
    await expect(manifestation.updatePeopleCount())
      .to.eventually.be.an("object")
      .that.has.property("people")
      .which.is.equals(3);
  });

  it("will get last crawl status ordered by they _id", async () => {
    const manifestation = await factory.create("manifestation");

    expect(manifestation.getLastCrawlStatus("instagram")).to.be.an("object");
  });
});
