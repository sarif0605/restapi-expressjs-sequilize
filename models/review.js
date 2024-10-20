"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan user id tidak boleh kosong",
          },
          isExist(value) {
            return sequelize.models.User.findByPk(value).then((el) => {
              if (!el) throw new Error("user not found");
            });
          },
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan product id tidak boleh kosong",
          },
          isExist(value) {
            return sequelize.models.Product.findByPk(value).then((el) => {
              if (!el) throw new Error("product not found");
            });
          },
        },
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan point tidak boleh kosong",
          },
          min: {
            args: [1],
            msg: "point harus lebih dari 0",
          },
          max: {
            args: [5],
            msg: "point harus kurang dari 5",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan content tidak boleh kosong",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
