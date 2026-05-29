const { ApiError } = require("./apiError");

const TaskStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"];

const ACTIVE_STATUSES = new Set(["TODO", "IN_PROGRESS", "IN_REVIEW"]);

const TRANSITIONS = new Map([
  ["TODO", new Set(["IN_PROGRESS", "BLOCKED"])],
  ["IN_PROGRESS", new Set(["IN_REVIEW", "BLOCKED"])],
  ["IN_REVIEW", new Set(["DONE", "BLOCKED"])],
  ["DONE", new Set([])],
  ["BLOCKED", new Set([])]
]);

function assertValidStatus(status) {
  if (!TaskStatuses.includes(status)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid status");
  }
}

function canTransition(from, to) {
  assertValidStatus(from);
  assertValidStatus(to);
  return TRANSITIONS.get(from)?.has(to) ?? false;
}

function isActiveStatus(status) {
  assertValidStatus(status);
  return ACTIVE_STATUSES.has(status);
}

module.exports = { TaskStatuses, canTransition, isActiveStatus };

