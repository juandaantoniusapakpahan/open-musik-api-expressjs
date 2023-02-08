const { Pool } = require("pg");

class SongQuery {
  constructor(bigQuery) {
    this._pool = new Pool();
    this._bigQuery = bigQuery;
  }

  async _filter() {
    const bigQueryCopy = { ...this._bigQuery };

    let stringQuery = JSON.stringify(bigQueryCopy);
    stringQuery = stringQuery.replace(/\b(gte|lte|gt|lt)\b/g, (m) => `$${m}`);
    const jsonQuery = JSON.parse(stringQuery);
    let textBase = "SELECT * FROM songs";
    const query = {};
    console.log(jsonQuery);
    if (Object.keys(jsonQuery).length > 0) {
      textBase = "SELECT * FROM songs WHERE";
      let valuesBase = [];
      let index = 1;

      for (const queryparam in jsonQuery) {
        if (index === 1) {
          textBase = textBase + ` ${queryparam} LIKE lower($${index})`;
          ++index;
        } else {
          textBase = textBase + ` AND ${queryparam} LIKE lower($${index})`;
          ++index;
        }
        valuesBase.push(`%${jsonQuery[queryparam]}%`);
      }
      query.text = textBase;
      query.values = valuesBase;
    }

    const finalQuery = Object.keys(query).length !== 0 ? query : textBase;
    const resultQuery = await this._pool.query(finalQuery);
    console.log(textBase);
    console.log(finalQuery);
    const songs = resultQuery.rows;

    return songs;
  }
}

module.exports = SongQuery;
