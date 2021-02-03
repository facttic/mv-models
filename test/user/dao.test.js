const factory = require("../factories");
const { UserDAO } = require("../../user/dao");
const { Types } = require("mongoose");

describe("user", () => {
  context("create", () => {
    it("can be created correctly", async () => {
      const user = await factory.build("user");
      await expect(UserDAO.createNew(user)).to.be.fulfilled;
      await expect(UserDAO.getById(user._id)).to.eventually.include({
        name: user.name,
        email: user.email,
        superadmin: user.superadmin,
      });
    });

    it("cannot create user with an existent email", async () => {
      const user = await factory.create("user");
      const userToAdd = await factory.build("user", { email: user.email });
      delete userToAdd._doc._id;
      await expect(UserDAO.createNew(userToAdd)).to.be.rejectedWith("Email is in use");
    });

    it("will throw if creation body is invalid", async () => {
      const invalidUser = await factory.build("user", { name: null });
      await expect(UserDAO.createNew(invalidUser)).to.be.rejectedWith("User validation failed");
      await expect(UserDAO.getById(invalidUser._id)).to.eventually.equal(null);
    });
  });

  context("obtain", () => {
    it("will return every document", async () => {
      const users = await factory.createMany("user", 15);
      await expect(UserDAO.getAll({}))
        .to.eventually.be.an("array")
        .which.has.lengthOf(users.length);
    });

    it("will return null when attempting to find an unexistent user by id", async () => {
      const objectId = new Types.ObjectId();
      await expect(UserDAO.getById(objectId)).to.eventually.equal(null);
    });

    it("will return object when attempting to find an existent user by id", async () => {
      const user = await factory.create("user");

      await expect(UserDAO.getById(user._id))
        .to.eventually.be.an("object")
        .that.has.property("name")
        .which.equals(user.name);
    });
  });

  context("update", () => {
    beforeEach(async function () {
      this.user = await factory.create("user");
    });

    it("will update a user by id and return the updated object", async function () {
      const validuser = await factory.build("user");

      delete validuser._doc._id;

      await expect(UserDAO.udpate(this.user._id, validuser))
        .to.eventually.be.an("object")
        .that.has.property("name")
        .which.equals(validuser.name);
    });

    it("will throw if update body is invalid", async function () {
      const invalidUser = await factory.build("user", { name: null });

      delete invalidUser._doc._id;

      await expect(UserDAO.udpate(this.user._id, invalidUser)).to.be.rejectedWith(
        "Validation failed",
      );
    });
  });
  context("remove", () => {
    beforeEach(async function () {
      this.user = await factory.create("user");
    });
    it("will delete a user by id", async function () {
      await expect(UserDAO.removeById(this.user._id))
        .to.eventually.be.an("object")
        .that.has.property("ok")
        .which.equals(1);
    });
  });
});
