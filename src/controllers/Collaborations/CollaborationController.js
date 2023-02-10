const { Pool } = require("pg");
const BigPromise = require("../../middlewares/bigPromise");
const InvariantError = require("../../exception/InvariantError");
const verifyAuthorization = require("../../utils/verifyAuthorization");
const CollaborationValidator = require("../../domain/collaboration/CollaborationValidator");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exception/NotFoundError");

const _pool = new Pool();

/** POST */
exports.addCollaborations = BigPromise(async (req, res, next) => {
  try {
    const { playlistId, userId } = req.body;
    const id = req.user.id;

    // validate payload and owner
    CollaborationValidator._verifyPayload(req.body);
    await verifyAuthorization._verifyOwner(id, playlistId);

    const queryCheck = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const resultCheck = await _pool.query(queryCheck);
    if (resultCheck.rows.length > 0) {
      throw new InvariantError("Collaboration has been added");
    }

    const collaborationId = `collaboration-${nanoid(16)}`;
    const queryCollaboration = {
      text: "INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id, playlist_id, user_id",
      values: [collaborationId, playlistId, userId],
    };
    const result = await _pool.query(queryCollaboration);
    const collaboration = result.rows[0];

    res.status(201).json({
      status: "success",
      message: "Collaborate was added",
      data: { collaboration },
    });
  } catch (error) {
    next(error);
  }
});

/** DELETE */
exports.deleteCollaborations = BigPromise(async (req, res, next) => {
  try {
    const { playlistId, userId } = req.body;
    const id = req.user.id;

    CollaborationValidator._verifyPayload(req.body);
    verifyAuthorization._verifyOwner(id, playlistId);

    const queryDelete = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const resultDelete = await _pool.query(queryDelete);

    if (resultDelete.rows.length < 1) {
      throw new NotFoundError("No found collaboration");
    }

    res.status(200).json({
      status: "success",
      message: "Collaborate was deleted",
    });
  } catch (error) {
    next(error);
  }
});
