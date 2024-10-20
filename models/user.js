"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: "user_id",
      });
      User.belongsToMany(models.Product, {
        through: "reviews",
        foreignKey: "user_id",
        as: "historyReview",
      });
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6],
        },
      },
      role_id: {
        type: DataTypes.UUID,
        // references : {
        //   model : 'Role',
        //   key : 'id'
        // },
        // onDelete : 'CASCADE',
        // onUpdate : 'CASCADE'
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
          }
          if (!user.role_id) {
            const roleUser = await sequelize.models.Role.findOne({
              where: {
                name: "user",
              },
            });
            user.role_id = roleUser.id;
          }
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.prototype.CorrectPassword = async function (reqPassword, passwordDB) {
    return await bcrypt.compareSync(reqPassword, passwordDB);
  };
  return User;
};
