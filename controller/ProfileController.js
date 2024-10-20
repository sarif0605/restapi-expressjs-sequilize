const asyncHanlde = require("../utils/asyncHandler");
const profile = require("../models/profile");

exports.updateOrCreateProfile = asyncHanlde(async (req, res) => {
  const { age, bio, address } = req.body;
  const isUser = req.user.id;
  const userData = await profile.findOne({ where: { userId: isUser } });
  if (userData) {
    await profile.update(
      {
        age: age || userData.age,
        bio: bio || userData.bio,
        address: address || userData.address,
      },
      {
        where: {
          userId: isUser,
        },
      }
    );
  } else {
    await profile.create({
      age,
      bio,
      address,
      userId: isUser,
    });
    message = "Profile berhasil dibuat";
  }
});
