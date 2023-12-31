const { CityRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

const cityRepository = new CityRepository();

async function createCity(data) {
  try {
    // This will return a city element and create a city in the base server.
    const city = await cityRepository.create(data);
    return city;
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError("Cannot create a new City object", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
//
module.exports = { createCity };
