const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const { TaskPriorities, TaskStatuses } = require("../config/constants");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orgId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    projectId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
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
    assigneeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    createdById: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
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
