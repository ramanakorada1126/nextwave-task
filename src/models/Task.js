const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const { TaskPriorities, TaskStatuses } = require("../config/constants");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orgId: { type: DataTypes.UUID, allowNull: false },
    projectId: { type: DataTypes.UUID, allowNull: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    priority: {
      type: DataTypes.ENUM(...TaskPriorities),
      allowNull: false,
      defaultValue: "MEDIUM",
    },
    status: {
      type: DataTypes.ENUM(...TaskStatuses),
      allowNull: false,
      defaultValue: "TODO",
    },
    assigneeId: { type: DataTypes.UUID, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    createdById: { type: DataTypes.UUID, allowNull: false },
    completedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "tasks",
    indexes: [
      { fields: ["orgId"] },
      { fields: ["status"] },
      { fields: ["assigneeId"] },
      { fields: ["dueDate"] },
      { fields: ["orgId", "assigneeId"] },
    ],
  },
);

module.exports = { Task };
