"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan data umur tidak boleh kosong",
          },
        },
      },
      bio: DataTypes.TEXT,
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan data alamat tidak boleh kosong",
          },
        },
      },
      image: DataTypes.STRING,
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan data userId tidak boleh kosong",
          },
          isExist(value) {
            return sequelize.models.User.findByPk(value).then((el) => {
              if (!el) throw new Error("user not found");
            });
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
