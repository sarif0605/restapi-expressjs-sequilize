"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: "categoryId",
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "nama kategori sudah ada, masukan nama kategori lain",
        },
        validate: {
          notNull: {
            msg: "inputan data kategori tidak boleh kosong",
          },
        },
      },
      description: DataTypes.TEXT,
    },
    {
      hooks: {
        afterValidate: (category, options) => {
          if (category.name) {
            category.name = category.name.toLowerCase();
          }
        },
      },
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
