const asyncHandler = require("../middleware/asyncHandle");
const { Product } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");
exports.addProduct = asyncHandler(async (req, res) => {
  let { name, description, price, categoryId, image, stock } = req.body;
  const file = req.file;
  if (!file) {
    res.status(400);
    throw new Error("Please upload an image");
  }
  const fileName = file.fieldname;
  const filePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileName}`;
  const newProduct = await Product.create({
    name,
    description,
    price,
    categoryId,
    image: filePath,
    stock,
  });
  res.status(200).json({
    status: "success",
    data: newProduct,
  });
});

exports.readProducts = asyncHandler(async (req, res) => {
  const { search, limit, page } = req.query;
  let productData = "";
  if (search || limit || page) {
    const pageData = page * 1 || 1;
    const limitData = limit * 1 || 10;
    const offsetData = (pageData - 1) * limitData;
    const searchData = search || "";
    const products = await Product.findAndCountAll({
      limit: limitData,
      offset: offsetData,
      where: {
        name: {
          [Op.like]: `%${searchData}%`,
        },
      },
      include: [
        {
          model: Category,
          attributes: { exclude: ["createdAt", "updatedAt", "description"] },
        },
      ],
    });
    productData = products;
  } else {
    const products = await Product.findAndCountAll({
      include: [
        {
          model: Category,
          attributes: { exclude: ["createdAt", "updatedAt", "description"] },
        },
      ],
    });
    productData = products;
  }
  res.status(200).json({
    status: "success",
    data: productData,
  });
});

exports.detailProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const productById = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        attributes: { exclude: ["createdAt", "updatedAt", "description"] },
      },
      {
        model: Review,
        attributes: { exclude: ["user_id", "product_id"] },
        include: [
          {
            model: User,
            attributes: ["name"],
            include: [
              {
                model: Profile,
                attributes: ["age", "image"],
              },
            ],
          },
        ],
      },
    ],
  });
  if (!productById) {
    res.status(400);
    throw new Error("data tidak ditemukan");
  }
  return res.status(200).json({
    status: "Success",
    data: productById,
  });
});

exports.uploadImageData = asyncHandler(async (req, res) => {
  const idUser = req.user.id;
  const profileData = await Profile.findOne({ where: { user_id: idUser } });
  if (!profileData) {
    res.status(400);
    throw new Error("Profile data not found");
  }
  const file = req.file;
  if (profileData.image) {
    const nameImage = profileData.image.replace(
      `${req.protocol}://${req.get("host")}/public/uploads/`,
      ""
    );
    const filePath = `./public/uploads/${nameImage}`;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath, (err) => {});
    }
    if (!file) {
      res.status(400);
      throw new Error("Please upload an image");
    }

    await Profile.update(
      {
        image: filePath,
      },
      {
        where: {
          user_id: idUser,
        },
      }
    );
    return res.status(200).json({
      status: "success",
      data: profileData,
    });
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let { name, description, price, categoryId, stock } = req.body;
  const productData = await Product.findByPk(id);
  if (!productData) {
    res.status(400);
    throw new Error("Data tidak ditemukan");
  }

  const file = req.file;
  if (file) {
    const nameImage = productById.image.replace(
      `${req.protocol}://${req.get("host")}/public/uploads/`,
      ""
    );
    const filePath = `./public/uploads/${currentImage}`;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath, (err) => {
        if (err) {
          res.status(400);
          throw new Error("Gagal menghapus file lama");
        }
      });
    }
    const newFileName = file.filename;
    const newFilePath = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/${newFileName}`;
    productData.image = newFilePath;
  }
  productData.name = name || productData.name;
  productData.description = description || productData.description;
  productData.price = price || productData.price;
  productData.categoryId = categoryId || productData.categoryId;
  productData.stock = stock || productData.stock;
  await productData.save();
  return res.status(200).json({
    status: "Success",
    data: productData,
  });
});

exports.destroyProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const productById = await Product.findByPk(id);
  if (productById) {
    const nameImage = productById.image.replace(
      `${req.protocol}://${req.get("host")}/public/uploads/`,
      ""
    );
    const filePath = `./public/uploads/${nameImage}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(400);
        throw new Error("Gagal menghapus file lama");
      }
    });
    productById.destroy();
    return res.status(200).json({
      status: "Success",
    });
  } else {
    res.status(400);
    throw new Error("Data tidak ditemukan");
  }
});
