"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
      });

      Product.hasMany(models.Review, {
        foreignKey: "product_id",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan category id tidak boleh kosong",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan image tidak boleh kosong",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countReview: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      avgReview: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
