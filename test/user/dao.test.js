const factory = require("../../factories");
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
      const userToAdd = await factory.attrs("user", { email: user.email });

      await expect(UserDAO.createNew(userToAdd)).to.be.rejectedWith("Email is in use");
    });

    it("will throw if creation body is invalid", async () => {
      const invalidUser = await factory.build("user", { name: null });
      await expect(UserDAO.createNew(invalidUser)).to.be.rejectedWith("User validation failed");
      await expect(UserDAO.getById(invalidUser._id)).to.eventually.equal(null);
    });

    it("will throw if the email in the creation body is invalid", async () => {
      const invalidUser = await factory.build("user", { email: "mimail.net" });
      await expect(UserDAO.createNew(invalidUser)).to.be.rejectedWith("Invalid Email address");
      await expect(UserDAO.getById(invalidUser._id)).to.eventually.equal(null);
    });

    it("will throw if update body include unexistent fields", async () => {
      const user = await factory.create("user");
      const invalidUser = await factory.attrs("user", { foo: "bar" });

      await expect(UserDAO.udpate(user._id, invalidUser)).to.be.rejectedWith("not in schema");
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

    it("will return object which contains no password when converting to json", async () => {
      const user = await factory.create("user");
      const userFetched = await UserDAO.getById(user._id);

      expect(userFetched.toJSON()).to.not.have.property("password");
    });

    it("will replace _id by id when converting to JSON", async () => {
      const user = await factory.create("user");
      const userFetched = await UserDAO.getById(user._id);

      expect(userFetched.toJSON()).to.have.property("id");
      expect(userFetched.toJSON()).to.not.have.property("_id");
    });

    it("will return a user by its credentials", async () => {
      const user = await factory.create("user", { password: "holahola" });

      await expect(UserDAO.findByCredentials(user.email, "holahola"))
        .to.eventually.be.an("object")
        .that.has.property("name")
        .which.equals(user.name);
    });

    it("will throw if the email doesnt exist", async () => {
      await factory.create("user", { password: "holahola" });

      await expect(UserDAO.findByCredentials("imnothere@here.net", "holahola")).to.be.rejectedWith(
        "Invalid login credentials",
      );
    });

    it("will throw if password doesnt match", async () => {
      const user = await factory.create("user", { password: "holahola" });

      await expect(UserDAO.findByCredentials(user.email, "holachau")).to.be.rejectedWith(
        "Invalid login credentials",
      );
    });
  });

  context("update", () => {
    beforeEach(async function () {
      this.user = await factory.create("user");
    });

    it("will update a user by id and return the updated object", async function () {
      const validuser = await factory.attrs("user");

      await expect(UserDAO.udpate(this.user._id, validuser))
        .to.eventually.be.an("object")
        .that.has.property("name")
        .which.equals(validuser.name);
    });

    it("will throw if update body is invalid", async function () {
      const invalidUser = await factory.attrs("user", { name: null });

      await expect(UserDAO.udpate(this.user._id, invalidUser)).to.be.rejectedWith(
        "Validation failed",
      );
    });

    it("will throw if update body include unexistent fields", async () => {
      const user = await factory.create("user");
      const invalidUser = await factory.attrs("user", { foo: "bar" });

      await expect(UserDAO.udpate(user._id, invalidUser)).to.be.rejectedWith("not in schema");
    });
  });

  context("remove", () => {
    beforeEach(async function () {
      this.user = await factory.create("user");
    });

    it("will delete a user by id", async function () {
      await expect(UserDAO.removeById(this.user._id)).to.eventually.equal(this.user._id);
    });

    it("will return null when delete a user by unexistent id", async function () {
      await expect(UserDAO.removeById(new Types.ObjectId())).to.eventually.equal(null);
    });
  });

  context("token", () => {
    it("will create and add a new token for the user", async () => {
      const user = await factory.create("user");
      const tokensLength = user.tokens.length;
      const token = await user.generateAuthToken();

      await expect(UserDAO.getById(user._id))
        .to.eventually.be.an("object")
        .that.has.property("tokens")
        .which.has.lengthOf(tokensLength + 1)
        .and.nested.property(`[${tokensLength}].token`)
        .which.equals(token);
    });
  });
});
