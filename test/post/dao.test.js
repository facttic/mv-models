/* eslint-disable no-unused-expressions */
const factory = require("../factories");
const { PostDAO } = require("../../post/dao");
const { Types } = require("mongoose");

describe("post", () => {
  context("create", () => {
    it("can be created correctly", async () => {
      const post = await factory.build("post");
      await expect(PostDAO.createNew(post)).to.be.fulfilled;
      await expect(PostDAO.getById(post._id)).to.eventually.include({
        post_id_str: post.post_id_str,
      });
    });

    it("will throw if creation body is invalid", async () => {
      const invalidDenyList = await factory.build("post", { post_id_str: null });
      await expect(PostDAO.createNew(invalidDenyList)).to.be.rejectedWith("Post validation failed");
      await expect(PostDAO.getById(invalidDenyList._id)).to.eventually.equal(null);
    });
  });

  context("get", () => {
    it("will return every document", async () => {
      const posts = await factory.createMany("post", 15);
      await expect(PostDAO.getAll({}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(posts.length);
    });

    it("will return an empty list if there are no documents", async () => {
      await expect(PostDAO.getAll({}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(0);
    });

    it("will return every document associated to the manifestation_id", async () => {
      const manifestation = await factory.create("manifestation");

      const posts = await factory.createMany("post", 6, {
        manifestation_id: manifestation._id,
      });
      await factory.createMany("post", 15);

      await expect(PostDAO.getAllByManifestationId(manifestation._id, {}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(posts.length);
    });

    it("will return an empty list if there are no documents associated to the manifestation_id", async () => {
      const [manifestation1, manifestation2] = await factory.createMany("manifestation", 2);

      await factory.createMany("post", 6, {
        manifestation_id: manifestation2._id,
      });
      await factory.createMany("post", 15);

      await expect(PostDAO.getAllByManifestationId(manifestation1._id, {}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(0);
    });

    it("will retrieve a post by id", async () => {
      const post = await factory.create("post");
      await expect(PostDAO.getById(post._id))
        .to.eventually.be.an("object")
        .that.has.property("post_id_str")
        .which.equals(post.post_id_str);
    });

    it("will return null when attempting to find an unexistent post by id", async () => {
      const objectId = new Types.ObjectId();
      await expect(PostDAO.getById(objectId)).to.eventually.equal(null);
    });
  });

  context("delete", () => {
    it("will delete a document by id", async () => {
      const post = await factory.create("post");

      await expect(PostDAO.removeById(post._id)).to.be.fulfilled;
      await expect(PostDAO.getById(post._id)).to.eventually.equal(null);
    });

    it("will fail to delete a document by an unexistent id", async () => {
      const objectId = new Types.ObjectId();

      await expect(PostDAO.removeById(objectId)).to.be.rejectedWith("Post does not exist");
    });
  });

  context("count users", () => {});
});
