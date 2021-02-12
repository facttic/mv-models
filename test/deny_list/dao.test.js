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

    it("will throw if creation body include unexistent fields", async () => {
      const invalidDenyList = await factory.attrs("deny_list", { foo: "bar" });
      await expect(DenyListDAO.createNew(invalidDenyList)).to.be.rejectedWith("not in schema");
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
      await expect(DenyListDAO.getAll({})).to.eventually.be.an("object").that.has.property("list")
        .which.is.empty;
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
        .that.has.property("list").which.is.empty;
    });

    it("will retrieve a denyList by id", async () => {
      const denyList = await factory.create("deny_list");
      await expect(DenyListDAO.getById(denyList._id))
        .to.eventually.be.an("object")
        .that.has.property("user_id_str")
        .which.equals(denyList.user_id_str);
    });

    it("will replace _id by id when converting to JSON", async () => {
      const denyList = await factory.create("deny_list");
      const denyListFetched = await DenyListDAO.getById(denyList._id);

      expect(denyListFetched.toJSON()).to.have.property("id");
      expect(denyListFetched.toJSON()).to.not.have.property("_id");
    });

    it("will return null when attempting to find an unexistent deny_list by id", async () => {
      const objectId = new Types.ObjectId();
      await expect(DenyListDAO.getById(objectId)).to.eventually.equal(null);
    });
  });

  context("delete", () => {
    it("will delete a document by id and return that id on success", async () => {
      const objectId = new Types.ObjectId();

      const { _id } = await factory.create("deny_list");

      await expect(DenyListDAO.removeById(_id, objectId)).to.eventually.equal(_id);
      await expect(DenyListDAO.getById(_id)).to.eventually.equal(null);
    });

    it("will return null when deleting a document by an unexistent id", async () => {
      const objectId = new Types.ObjectId();

      await expect(DenyListDAO.removeById(objectId)).to.eventually.equal(null);
    });
  });

  context("is deny listed", () => {
    it("will return a denyList by its user_id_str", async () => {
      const denyList = await factory.create("deny_list");

      await expect(DenyListDAO.getByUserIdStr(denyList.user_id_str))
        .to.eventually.be.an("object")
        .that.has.property("user_id_str")
        .which.equals(denyList.user_id_str);
    });

    it("will return null if there's no denyList with a user_id_str", async () => {
      await factory.create("deny_list");

      await expect(DenyListDAO.getByUserIdStr("123noestadeshabilitado")).to.eventually.equal(null);
    });

    it("will return a denyList by its user_id_str and a manifestation_id", async () => {
      const manifestation = await factory.create("manifestation");
      const denyList = await factory.create("deny_list", { manifestation_id: manifestation._id });

      await expect(
        DenyListDAO.getByUserIdStrByManifestationId(manifestation._id, denyList.user_id_str),
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
        DenyListDAO.getByUserIdStrByManifestationId(manifestation2._id, denyList.user_id_str),
      ).to.eventually.equal(null);
    });
  });
});
