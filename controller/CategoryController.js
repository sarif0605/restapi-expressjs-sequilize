const { where } = require("sequelize");
const { category } = require("../models");
const asyncHandle = require("../middleware/asyncHandle");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await category.findAll();
    return res.status(200).json({
      status: "Success",
      data: categories,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      error: error.errors,
    });
  }
};

exports.detailCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const categoryById = await category.findByPk(id, {
      include: [
        {
          model: product,
          attributes: { exclude: ["categoryId"] },
        },
      ],
    });
    if (!categoryById) {
      return res.status(400).json({
        status: "Fail",
        error: "data tidak ditemukan",
      });
    }
    return res.status(200).json({
      status: "Success",
      data: categoryById,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      error: error.errors,
    });
  }
};

exports.storeCategory = async (req, res) => {
  try {
    let { name, description } = req.body;
    const newCategory = await category.create({ name, description });
    return res.status(200).json({
      status: "Success",
      data: newCategory,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      error: error.errors,
    });
  }
};

exports.updateCategory = asyncHandle(async (req, res) => {
  try {
    const id = req.params.id;
    await category.update(req.body, {
      where: {
        id: id,
      },
    });
    const newCategory = await category.findByPk(id);
    if (!newCategory) {
      res.status(404);
      throw new Error("data tidak ditemukan");
    }
    return res.status(200).json({
      status: "Success",
      data: newCategory,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      error: error.errors,
    });
  }
});

exports.destroyCategory = asyncHandle(async (req, res) => {
  const id = req.params.id;
  const idCategory = await category.findByPk(id);
  if (!idCategory) {
    return res.status(400).json({
      status: "Fail",
      data: "Id tidak ditemukan",
    });
  }
  await category.destroy({ where: { id: id } });
  return res.status(200).json({
    status: "Success",
    data: `data dengan id ${id} berhasil dihapus`,
  });
});
