const BME280 = require('./BME280');
const { EventEmitter } = require("events")

const options = {
  i2cBusNo: 0,
  i2cAddress: BME280.BME280_DEFAULT_I2C_ADDRESS()
};

const bme280 = new BME280(options);

class THP extends EventEmitter {
  constructor() {
    super()
    bme280.init()
      .then(() => {
        console.log('BME280 initialization succeeded');
        this.startReading();
      })
      .catch((err) => console.error(`BME280 initialization failed: ${err} `));
  }

  readSensorData() {
    bme280.readSensorData()
      .then((data) => {
        this.emit("data", data)
        this.to = setTimeout(this.readSensorData, 0);
      })
      .catch((err) => {
        console.log(`BME280 read error: ${err}`);
        this.to = setTimeout(this.readSensorData, 0);
      });
  }

  startReading() {
    this.readSensorData()
  }

  stopReading() {
    clearTimeout(this.to)
  }
}

module.exports = () => new THP()