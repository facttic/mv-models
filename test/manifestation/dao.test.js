/* eslint-disable no-unused-expressions */
const factory = require("../factories");
const { buildCrawlStatus, buildHashtag } = require("../factories/manifestation");
const { ManifestationDAO } = require("../../manifestation/dao");
const { Types } = require("mongoose");

describe("manifestation", () => {
  context("create", () => {
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
  });

  context("get", () => {
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
  });

  context("update", () => {
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
  });

  context("delete", () => {
    it("will delete a document by id", async () => {
      const manifestation = await factory.create("manifestation");

      await expect(ManifestationDAO.removeById(manifestation._id)).to.be.fulfilled;
      await expect(ManifestationDAO.getById(manifestation._id)).to.eventually.equal(null);
    });
  });

  context("people", () => {
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
  });

  context("crawlStatuses", () => {
    it("will get last crawl status by source, ordered by their _id", async () => {
      const manifestation = await factory.create("manifestation", {
        crawlStatuses: [
          buildCrawlStatus({ post_id_str: "1", source: "instagram" }),
          buildCrawlStatus({ post_id_str: "2", source: "instagram" }),
          buildCrawlStatus({ post_id_str: "3", source: "instagram" }),
          buildCrawlStatus({ post_id_str: "13", source: "twitter" }),
        ],
      });

      expect(manifestation.getLastCrawlStatus("instagram"))
        .to.be.an("object")
        .that.has.property("post_id_str")
        .which.equals("3");
    });

    it("will get last crawl status by source and hashtag ordered by their _id", async () => {
      const manifestation = await factory.create("manifestation", {
        crawlStatuses: [
          buildCrawlStatus({ post_id_str: "1", hashtag: "everyone", source: "instagram" }),
          buildCrawlStatus({ post_id_str: "2", hashtag: "noHashtag", source: "instagram" }),
          buildCrawlStatus({ post_id_str: "3", hashtag: "everyone", source: "instagram" }),
          buildCrawlStatus({ post_id_str: "4", hashtag: "notEveryone", source: "instagram" }),
          buildCrawlStatus({ post_id_str: "13", hashtag: "everyone", source: "twitter" }),
          buildCrawlStatus({ post_id_str: "9", hashtag: "everyone", source: "instagram" }),
        ],
      });

      expect(manifestation.getLastCrawlStatusByHashtag("instagram", "everyone"))
        .to.be.an("object")
        .that.has.property("post_id_str")
        .which.equals("9");
    });

    it("will return undefined if there's no crawlStatus to match query", async () => {
      const manifestation = await factory.create("manifestation", {
        crawlStatuses: [buildCrawlStatus({ hashtag: "everyone", source: "instagram" })],
      });

      expect(manifestation.getLastCrawlStatusByHashtag("twitter", "everyone")).to.be.undefined;
    });

    it("will add a new crawl status accordingly", async () => {
      const manifestation = await factory.create("manifestation");
      const initialLength = manifestation.get("crawlStatuses").length;

      const newCrawlStatus = buildCrawlStatus();

      await expect(manifestation.newCrawlStatus(newCrawlStatus))
        .to.eventually.be.an("object")
        .that.has.property("crawlStatuses")
        .which.has.lengthOf(initialLength + 1);
    });

    it("will fail to add a new crawl status if the doc is invalid", async () => {
      const manifestation = await factory.create("manifestation");
      const initialLength = manifestation.get("crawlStatuses").length;

      const newCrawlStatus = buildCrawlStatus({ post_id_str: null });

      await expect(manifestation.newCrawlStatus(newCrawlStatus)).to.be.rejectedWith(
        "Manifestation validation failed",
      );

      await expect(ManifestationDAO.getById(manifestation._id))
        .to.eventually.be.an("object")
        .that.has.property("crawlStatuses")
        .which.has.lengthOf(initialLength);
    });
  });

  context("hashtags", () => {
    it("will add a new hashtag accordingly", async () => {
      const manifestation = await factory.create("manifestation");
      const initialLength = manifestation.get("hashtags").length;

      const newHashtag = buildHashtag();

      await expect(manifestation.newHashtag(newHashtag))
        .to.eventually.be.an("object")
        .that.has.property("hashtags")
        .which.has.lengthOf(initialLength + 1);
    });

    it("will fail to add a new hashtag if the doc is invalid", async () => {
      const manifestation = await factory.create("manifestation");
      const initialLength = manifestation.get("hashtags").length;

      const newHashtag = buildHashtag({ name: null });

      await expect(manifestation.newHashtag(newHashtag)).to.be.rejectedWith(
        "Manifestation validation failed",
      );

      await expect(ManifestationDAO.getById(manifestation._id))
        .to.eventually.be.an("object")
        .that.has.property("hashtags")
        .which.has.lengthOf(initialLength);
    });

    it("will return every hashtag", async () => {
      const manifestation = await factory.create("manifestation");

      expect(manifestation.getAllHashtags())
        .to.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(manifestation.get("hashtags").length);
    });

    it("will return an empty list if there are no hashtags", async () => {
      const manifestation = await factory.create("manifestation", { hashtags: [] });

      expect(manifestation.getAllHashtags())
        .to.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(0);
    });

    it("will return every hashtag filtered by source", async () => {
      const manifestation = await factory.create("manifestation", {
        hashtags: [
          buildHashtag({ source: "instagram" }),
          buildHashtag({ source: "twitter" }),
          buildHashtag({ source: "instagram" }),
          buildHashtag({ source: "instagram" }),
          buildHashtag({ source: "twitter" }),
        ],
      });

      expect(manifestation.getHashtagsBySource("instagram"))
        .to.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(3);
    });

    it("will return an empty list if there are no hashtags (filtered by source)", async () => {
      const manifestation = await factory.create("manifestation", { hashtags: [] });

      expect(manifestation.getHashtagsBySource("instagram"))
        .to.be.an("object")
        .that.has.property("list")
        .which.has.lengthOf(0);
    });

    it("will delete a hashtag by _id", async () => {
      const manifestation = await factory.create("manifestation");
      const initialLength = manifestation.get("hashtags").length;
      const _id = manifestation.get("hashtags")[0]._id;

      await expect(manifestation.deleteHashtag(_id))
        .to.eventually.be.an("object")
        .that.has.property("hashtags")
        .which.has.lengthOf(initialLength - 1);
    });

    it("will fail to delete a hashtag with an unexistent _id", async () => {
      const manifestation = await factory.create("manifestation");
      const _id = Types.ObjectId();

      await expect(manifestation.deleteHashtag(_id)).to.eventually.equal(null);
    });

    it("will update a hashtag by _id", async () => {
      const manifestation = await factory.create("manifestation");
      const initialLength = manifestation.get("hashtags").length;
      const _id = manifestation.get("hashtags")[0]._id;
      const hashtag = buildHashtag();

      await expect(manifestation.updateHashtag(_id, hashtag))
        .to.eventually.be.an("object")
        .that.has.property("hashtags")
        .which.has.lengthOf(initialLength);

      expect(manifestation.get("hashtags")[0].name).to.be.equal(hashtag.name);
    });

    it("will fail to update a hashtag by _id with invalid properties", async () => {
      const manifestation = await factory.create("manifestation");
      const _id = manifestation.get("hashtags")[0]._id;
      const hashtag = buildHashtag({ name: null });

      await expect(manifestation.updateHashtag(_id, hashtag)).to.be.rejectedWith(
        "validation failed",
      );
    });

    it("will fail to update a hashtag with an unexistent _id", async () => {
      const manifestation = await factory.create("manifestation");
      const hashtag = buildHashtag();
      const _id = Types.ObjectId();

      await expect(manifestation.updateHashtag(_id, hashtag)).to.eventually.equal(null);
    });
  });
});
