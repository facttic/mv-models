const factory = require("../factories");
const { UserDAO } = require("../../user/dao");
const { Types } = require("mongoose");

describe("user", () => {
  it("can be created correctly", async () => {
    const user = await factory.build("user");
    await expect(UserDAO.createNew(user)).to.be.fulfilled;
    await expect(UserDAO.getById(user._id)).to.eventually.include({
      name: user.name,
      email: user.email,
      superadmin: user.superadmin,
    });
  });
});
