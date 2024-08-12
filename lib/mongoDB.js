import mongoose from "mongoose";
import chalk from "chalk";
const {
  Schema,
  connect,
  model: _model
} = mongoose;
const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const log = {
  info: msg => console.log(chalk.green("[INFO]"), msg),
  warn: msg => console.log(chalk.yellow("[WARN]"), msg),
  error: msg => console.log(chalk.red("[ERROR]"), msg)
};
export class mongoDB {
  constructor(url, options = defaultOptions) {
    this.url = url;
    this.options = options;
    this.data = this._data = {};
    this._schema = {};
    this._model = {};
    this.db = connect(this.url, {
      ...this.options
    }).then(() => log.info("Successfully connected to MongoDB")).catch(err => log.error("Failed to connect to MongoDB:", err));
  }
  async read() {
    this.conn = await this.db;
    let schema = this._schema = new Schema({
      data: {
        type: Object,
        required: true,
        default: {}
      }
    });
    try {
      this._model = _model("data", schema);
      log.info('Model "data" created successfully');
    } catch (e) {
      log.warn("Model creation error, falling back to existing model:", e);
      this._model = _model("data");
    }
    try {
      this._data = await this._model.findOne({});
      if (!this._data) {
        log.info("No existing data found, initializing new data");
        this.data = {};
        const [_, _data] = await Promise.all([this.write(this.data), this._model.findOne({})]);
        this._data = _data;
      } else {
        this.data = this._data.data;
        log.info("Data read successfully");
      }
    } catch (e) {
      log.error("Error reading data:", e);
    }
    return this.data;
  }
  async write(data) {
    if (!data) {
      log.warn("No data provided for writing");
      return Promise.reject("No data provided");
    }
    try {
      if (!this._data) {
        const newData = new this._model({
          data: data
        });
        await newData.save();
        log.info("New data saved successfully");
      } else {
        this._data.data = data;
        await this._data.save();
        log.info("Data updated successfully");
      }
      return Promise.resolve(true);
    } catch (e) {
      log.error("Error writing data:", e);
      return Promise.reject(e);
    }
  }
}
export class mongoDBV2 {
  constructor(url, options = defaultOptions) {
    this.url = url;
    this.options = options;
    this.models = [];
    this.data = {};
    this.lists = {};
    this.list = {};
    this.db = connect(this.url, {
      ...this.options
    }).then(() => log.info("Successfully connected to MongoDB")).catch(err => log.error("Failed to connect to MongoDB:", err));
  }
  async read() {
    this.conn = await this.db;
    let schema = new Schema({
      data: [{
        name: String
      }]
    });
    try {
      this.list = _model("lists", schema);
      log.info('Model "lists" created successfully');
    } catch (e) {
      log.warn("Model creation error, falling back to existing model:", e);
      this.list = _model("lists");
    }
    try {
      this.lists = await this.list.findOne({});
      if (!this.lists?.data) {
        log.info("Initializing new list data");
        await this.list.create({
          data: []
        });
        this.lists = await this.list.findOne({});
      }
      let garbage = [];
      for (let {
          name
        }
        of this.lists.data) {
        let collection;
        try {
          collection = _model(name, new Schema({
            data: Array
          }));
          log.info(`Model for collection "${name}" created successfully`);
        } catch (e) {
          log.warn(`Error creating model for collection "${name}":`, e);
          try {
            collection = _model(name);
            log.info(`Fallback model for collection "${name}" created successfully`);
          } catch (e) {
            garbage.push(name);
            log.error(`Error creating fallback model for collection "${name}":`, e);
          }
        }
        if (collection) {
          this.models.push({
            name: name,
            model: collection
          });
          let collectionsData = await collection.find({});
          this.data[name] = Object.fromEntries(collectionsData.map(v => v.data));
          log.info(`Data for collection "${name}" read successfully`);
        }
      }
      try {
        let del = await this.list.findOne({
          _id: this.lists._id
        });
        del.data = del.data.filter(v => !garbage.includes(v.name));
        await del.save();
        log.info("Cleaned up obsolete collections");
      } catch (e) {
        log.error("Error cleaning up collections:", e);
      }
    } catch (e) {
      log.error("Error reading data:", e);
    }
    return this.data;
  }
  async write(data) {
    if (!this.lists || !data) {
      log.warn("No data or lists provided for writing");
      return Promise.reject("No data or lists provided");
    }
    let collections = Object.keys(data);
    let listDoc = [];
    let index = 0;
    try {
      for (let key of collections) {
        if ((index = this.models.findIndex(v => v.name === key)) !== -1) {
          let doc = this.models[index].model;
          await doc.deleteMany().catch(err => log.warn("Error deleting documents for collection:", key, err));
          await doc.insertMany(Object.entries(data[key]).map(v => ({
            data: v
          })));
          listDoc.push({
            name: key
          });
          log.info(`Data for collection "${key}" updated successfully`);
        } else {
          let schema = new Schema({
            data: Array
          });
          let doc;
          try {
            doc = _model(key, schema);
            log.info(`Model for new collection "${key}" created successfully`);
          } catch (e) {
            log.warn(`Error creating model for new collection "${key}":`, e);
            doc = _model(key);
          }
          index = this.models.findIndex(v => v.name === key);
          this.models[index === -1 ? this.models.length : index] = {
            name: key,
            model: doc
          };
          await doc.insertMany(Object.entries(data[key]).map(v => ({
            data: v
          })));
          listDoc.push({
            name: key
          });
        }
      }
      await this.list.findOneAndUpdate({
        _id: this.lists._id
      }, {
        data: listDoc
      }, {
        new: true,
        upsert: true
      });
      log.info("Data written to lists successfully");
      return Promise.resolve(true);
    } catch (e) {
      log.error("Error writing data:", e);
      return Promise.reject(e);
    }
  }
}