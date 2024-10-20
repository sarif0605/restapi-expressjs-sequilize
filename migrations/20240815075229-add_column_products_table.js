"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Products", "avgReview", {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        after: "countReview",
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn("Products", "avgReview")]);
  },
};
