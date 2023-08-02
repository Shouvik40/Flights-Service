const CrudRepository = require("./crud-repository");
const { Flight } = require("../models");
const { response } = require("express");

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }
  async getAllFlights(filter, sort) {
    const response = await Flight.findAll({
      where: filter,
      order: sort,
    });
    return response;
  }
}

module.exports = FlightRepository;
