const InvariantError = require("../../exception/InvariantError");

class AlbumValidator {
  constructor() {}

  _verifyPayload({ name, year }) {
    if (!name || !year) {
      throw new InvariantError("ALBUM.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof name !== "string" || typeof year !== "number") {
      throw new InvariantError("ALBUM.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    if (!name.match(/^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/)) {
      throw new InvariantError("ALBUM.NAME_CONTAIN_RESTRICTED_CHARACTER");
    }
  }
}
module.exports = AlbumValidator;
