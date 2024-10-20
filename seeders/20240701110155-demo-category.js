"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("categories", [
      {
        id: 1,
        name: "dina",
        description: "lorem ipsum dolor sit amet",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "dina 2",
        description: "lorem ipsum dolor sit amet",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "dina 3",
        description: "lorem ipsum dolor sit amet",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
