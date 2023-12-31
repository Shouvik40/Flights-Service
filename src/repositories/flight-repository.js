const CrudRepository = require("./crud-repository");
const { Flight, Airport, City, Airplane } = require("../models");
const db = require("../models");
const { Sequelize, Op } = require("sequelize");
const { convertToBoolean } = require("../utils/helpers/conversion-herpers");
const { addRowLockOnFlights } = require("./queries");
class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }
  async getAllFlights(filter, sort) {
    const response = await Flight.findAll({
      where: filter,
      order: sort,
      include: [
        {
          model: Airplane,
          as: "airplaneDetail",
          required: true,
        },
        {
          model: Airport,
          as: "departureAirport",
          required: true,
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departureAirport.code")
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
        {
          model: Airport,
          as: "arrivalAirport",
          required: true,
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrivalAirport.code")
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
      ],
    });
    return response;
  }
  async updateRemainingSeats(flightId, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
    try {
      // This line is for ROW LOCK
      await db.sequelize.query(addRowLockOnFlights(flightId));

      let ifDecrease = convertToBoolean(dec);
      const flight = await Flight.findByPk(flightId);

      if (ifDecrease) {
        await flight.decrement(
          "totalSeats",
          { by: seats },
          { transaction: transaction }
        );
      } else {
        await flight.increment(
          "totalSeats",
          { by: seats },
          { transaction: transaction }
        );
      }
      await transaction.commit();
      return flight;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = FlightRepository;
