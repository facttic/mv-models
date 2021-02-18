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
      const invalidPost = await factory.build("post", { post_id_str: null });
      await expect(PostDAO.createNew(invalidPost)).to.be.rejectedWith("Post validation failed");
      await expect(PostDAO.getById(invalidPost._id)).to.eventually.equal(null);
    });

    it("can create many correctly", async () => {
      const posts = await factory.buildMany("post", 3);
      await expect(PostDAO.createMany(posts))
        .to.eventually.be.an("Array")
        .which.has.lengthOf(posts.length);

      await expect(PostDAO.getAll({}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(posts.length);
    });

    it("insert only those many whos body is valid", async () => {
      const posts = await factory.buildMany("post", 5);
      const invalidPosts = await factory.buildMany("post", 7, { post_id_str: null });

      await expect(PostDAO.createMany([...posts, ...invalidPosts]))
        .to.eventually.be.an("Array")
        .which.has.lengthOf(posts.length);

      await expect(PostDAO.getAll({}))
        .to.eventually.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(posts.length);
    });

    it("will insert nothing with an empty array", async () => {
      await expect(PostDAO.createMany([])).to.eventually.be.an("Array").which.is.empty;

      await expect(PostDAO.getAll({})).to.eventually.be.an("object").that.has.property("list").which
        .is.empty;
    });

    it("will insert nothing if all bodies are invalid", async () => {
      const invalidPosts = await factory.buildMany("post", 7, { post_id_str: null });

      await expect(PostDAO.createMany(invalidPosts)).to.eventually.be.an("Array").which.is.empty;

      await expect(PostDAO.getAll({})).to.eventually.be.an("object").that.has.property("list").which
        .is.empty;
    });

    it("will throw if creation body include unexistent fields", async () => {
      const invalidPost = await factory.attrs("post", { address: "anything" });
      await expect(PostDAO.createNew(invalidPost)).to.be.rejectedWith("not in schema");
      await expect(PostDAO.getById(invalidPost._id)).to.eventually.equal(null);
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
      await expect(PostDAO.getAll({})).to.eventually.be.an("object").that.has.property("list").which
        .is.empty;
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
        .that.has.property("list").which.is.empty;
    });

    it("will retrieve a post by id", async () => {
      const post = await factory.create("post");
      await expect(PostDAO.getById(post._id))
        .to.eventually.be.an("object")
        .that.has.property("post_id_str")
        .which.equals(post.post_id_str);
    });

    it("will replace _id by id when converting to JSON", async () => {
      const post = await factory.create("post");
      const postFetched = await PostDAO.getById(post._id);

      expect(postFetched.toJSON()).to.have.property("id");
      expect(postFetched.toJSON()).to.not.have.property("_id");
    });

    it("will retrieve a post by postIdStr and source", async () => {
      const post = await factory.create("post");

      await expect(PostDAO.getByPostIdStrBySource(post.post_id_str, post.source))
        .to.eventually.be.an("object")
        .that.has.property("post_id_str")
        .which.equals(post.post_id_str);
    });

    it("will return null when attempting to find an unexistent postIdStr and source combination", async () => {
      const post = await factory.create("post");

      await expect(
        PostDAO.getByPostIdStrBySource(post.post_id_str, "facebook"),
      ).to.eventually.equal(null);
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

    it("will delete a document by id and manifestationId", async () => {
      const post = await factory.create("post");

      await expect(PostDAO.removeByIdByManifestationId(post.manifestation_id, post._id)).to.be
        .fulfilled;
      await expect(PostDAO.getById(post._id)).to.eventually.equal(null);
    });

    it("will fail to delete a document by unexistent id and manifestationId combination", async () => {
      const post = await factory.create("post");
      const objectId = new Types.ObjectId();

      await expect(PostDAO.removeByIdByManifestationId(objectId, post._id)).to.eventually.equal(null);
    });

    it("will fail to delete a document by an unexistent id", async () => {
      const objectId = new Types.ObjectId();

      await expect(PostDAO.removeById(objectId)).to.eventually.equal(null);
    });

    it("will delete a document by userIdStr", async () => {
      const post = await factory.create("post");

      await expect(PostDAO.removeByUserIdStr(post.user.id_str)).to.be.fulfilled;
      await expect(PostDAO.getById(post._id)).to.eventually.equal(null);
    });

    it("will fail to delete a document by an unexistent userIdStr", async () => {
      const objectId = new Types.ObjectId();

      await expect(PostDAO.removeByUserIdStr(objectId)).to.eventually.equal(null);
    });
  });

  context("count users", () => {
    it("will count distinct users by manifestationId", async () => {
      const [manifestation1, manifestation2] = await factory.createMany("manifestation", 2);

      await factory.createMany("post", 6, {
        "user.id_str": "12345",
        manifestation_id: manifestation1._id,
      });
      await factory.createMany("post", 8, {
        "user.id_str": "67890",
        manifestation_id: manifestation1._id,
      });
      await factory.createMany("post", 24, {
        "user.id_str": "67890",
        manifestation_id: manifestation2._id,
      });

      await expect(PostDAO.countUsersByManifestationId(manifestation1._id)).to.eventually.equal(2);
      await expect(PostDAO.countUsersByManifestationId(manifestation2._id)).to.eventually.equal(1);
    });

    it("will return zero when no posts are there for the manifestation", async () => {
      const [manifestation1, manifestation2] = await factory.createMany("manifestation", 2);
      const objectId = new Types.ObjectId();

      await factory.createMany("post", 6, {
        "user.id_str": "12345",
        manifestation_id: manifestation1._id,
      });
      await factory.createMany("post", 24, {
        "user.id_str": "67890",
        manifestation_id: manifestation2._id,
      });

      await expect(PostDAO.countUsersByManifestationId(objectId)).to.eventually.equal(0);
    });
  });
});
