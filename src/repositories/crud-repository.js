const { logger } = require("../config");
const AppError = require("../utils/errors/app-error");
const { Enums } = require("../utils/common");
const { STATUS_CODE } = Enums;

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }

  async destroy(data) {
    const response = await this.model.destroy({
      where: {
        id: data,
      },
    });
    if (!response) {
      throw new AppError("Data Not Found", STATUS_CODE.NOT_FOUND);
    }
    return response;
  }

  async get(data) {
    const response = await this.model.findByPk(data);
    return response;
  }

  async getAll() {
    const response = await this.model.findAll();
    return response;
  }

  async update(id, data) {
    const [updatedCount] = await this.model.update(data, {
      where: { id: id },
    });

    if (updatedCount === 0) {
      throw new AppError("Data Not Found", STATUS_CODE.NOT_FOUND);
    }
    const updatedRecord = await this.get(id);
    return updatedRecord;
  }
}

module.exports = CrudRepository;
