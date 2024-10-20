const asyncHandle = require("../middleware/asyncHandle");
const { review } = require("../models");
const { sequelize, where } = require("sequelize");
const product = require("../models/product");

const accerageDataProduct = async (idDataProduct) => {
  const restReview = await review.findOne({
    attributes: [
      [sequelize.fn("AVG", sequelize.col("point")), "avgPoint"],
      where({ productId: idDataProduct }),
    ],
  });
  const rataRata = Number(restReview.dataValues.avgPoint);
  await product.update(
    {
      avgReview: rataRata,
    },
    {
      where: {
        id: idDataProduct,
      },
    }
  );
};

exports.createOrUpdateReview = asyncHandle(async (req, res) => {
  const idUser = req.user.id;
  const idProduct = req.params.productId;
  const { point, comment } = req.body;
  let msg = "";
  const myReview = await review.findOne({
    where: {
      userId: idUser,
      productId: idProduct,
    },
  });
  if (myReview) {
    await review.update({ point, comment }, { where: { id: myReview.id } });
    await accerageDataProduct(idProduct);
    msg = "review updated";
  } else {
    await review.create({
      userId: idUser,
      productId: idProduct,
      point,
      comment,
    });
    await product.increment({ review: 1 }, { where: { id: idProduct } });
    await accerageDataProduct(idProduct);
    msg = "review created";
  }
  return res.status(200).json({
    message: msg,
  });
});
