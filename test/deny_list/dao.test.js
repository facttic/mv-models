/* eslint-disable no-unused-expressions */
const factory = require("../factories");
const { DenyListDAO } = require("../../deny_list/dao");
const { Types } = require("mongoose");

describe("denylist", () => {
  context("create", () => {
    it("can be created correctly", async () => {
      const denyList = await factory.build("deny_list");
      await expect(DenyListDAO.createNew(denyList)).to.be.fulfilled;
      await expect(DenyListDAO.getById(denyList._id)).to.eventually.include({
        user_id_str: denyList.user_id_str,
      });
    });

    it("will throw if creation body is invalid", async () => {
      const invalidDenyList = await factory.build("deny_list", { user_id_str: null });
      await expect(DenyListDAO.createNew(invalidDenyList)).to.be.rejectedWith(
        "DenyList validation failed",
      );
      await expect(DenyListDAO.getById(invalidDenyList._id)).to.eventually.equal(null);
    });
  });

  context("get", () => {
    it("will return every document", async () => {
      const denyLists = await factory.createMany("deny_list", 15);
      await expect(DenyListDAO.getAll({}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(denyLists.length);
    });

    it("will return an empty list if there are no documents", async () => {
      await expect(DenyListDAO.getAll({}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(0);
    });

    it("will return every document associated to the manifestation_id", async () => {
      const manifestation = await factory.create("manifestation");

      const denyLists = await factory.createMany("deny_list", 6, {
        manifestation_id: manifestation._id,
      });
      await factory.createMany("deny_list", 15);

      await expect(DenyListDAO.getAllByManifestationId(manifestation._id, {}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(denyLists.length);
    });

    it("will return an empty list if there are no documents associated to the manifestation_id", async () => {
      const [manifestation1, manifestation2] = await factory.createMany("manifestation", 2);

      await factory.createMany("deny_list", 6, {
        manifestation_id: manifestation2._id,
      });
      await factory.createMany("deny_list", 15);

      await expect(DenyListDAO.getAllByManifestationId(manifestation1._id, {}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(0);
    });

    it("will retrieve a denyList by id", async () => {
      const denyList = await factory.create("deny_list");
      await expect(DenyListDAO.getById(denyList._id))
        .to.eventually.be.an("object")
        .that.has.property("user_id_str")
        .which.equals(denyList.user_id_str);
    });

    it("will return null when attempting to find an unexistent deny_list by id", async () => {
      const objectId = new Types.ObjectId();
      await expect(DenyListDAO.getById(objectId)).to.eventually.equal(null);
    });
  });

  context("delete", () => {
    it("will delete a document by id", async () => {
      const denyList = await factory.create("deny_list");

      await expect(DenyListDAO.removeById(denyList._id)).to.be.fulfilled;
      await expect(DenyListDAO.getById(denyList._id)).to.eventually.equal(null);
    });

    it("will fail to delete a document by an unexistent id", async () => {
      const objectId = new Types.ObjectId();

      await expect(DenyListDAO.removeById(objectId)).to.be.rejectedWith("Denylist does not exist");
    });
  });

  context("is deny listed", () => {
    it("will return a denyList by its user_id_str", async () => {
      const denyList = await factory.create("deny_list");

      await expect(DenyListDAO.isDenyListed(denyList.user_id_str))
        .to.eventually.be.an("object")
        .that.has.property("user_id_str")
        .which.equals(denyList.user_id_str);
    });

    it("will return null if there's no denyList with a user_id_str", async () => {
      await factory.create("deny_list");

      await expect(DenyListDAO.isDenyListed("123noestadeshabilitado")).to.eventually.equal(null);
    });

    it("will return a denyList by its user_id_str and a manifestation_id", async () => {
      const manifestation = await factory.create("manifestation");
      const denyList = await factory.create("deny_list", { manifestation_id: manifestation._id });

      await expect(
        DenyListDAO.isDenyListedByManifestationId(manifestation._id, denyList.user_id_str),
      )
        .to.eventually.be.an("object")
        .that.has.property("user_id_str")
        .which.equals(denyList.user_id_str);
    });

    it("will return null if there's no denyList with a user_id_str in that manifestation_id", async () => {
      const [manifestation1, manifestation2] = await factory.createMany("manifestation", 2);
      // it does exist in manifestation1
      const denyList = await factory.create("deny_list", { manifestation_id: manifestation1._id });

      // will not get it in manifestation2
      await expect(
        DenyListDAO.isDenyListedByManifestationId(manifestation2._id, denyList.user_id_str),
      ).to.eventually.equal(null);
    });
  });
});
