module.exports = class Connection {
	constructor(config) {
		this.Mongoose = require("mongoose");
		this.logger = require("./logger");

		this.connection = false;

		this.config = config || {};
		if(!this.config.dir) this.config.dir = "mongodb://localhost/filehost";

		return this;
	}

	connect() {
		return new Promise((res, rej) => {
			this.Mongoose.connect(this.config.dir, { useNewUrlParser: true, useUnifiedTopology: true } );
			this.connection = this.Mongoose.connection;

			this.connection.on("error", e => this.logger.error(e.message));
			this.connection.once("open", res);
		});
	}
}
