const { Organization } = require("./Organization");
const { User } = require("./User");
const { Project } = require("./Project");
const { Task } = require("./Task");
const { RefreshToken } = require("./RefreshToken");

Organization.hasMany(User, { foreignKey: "orgId", as: "users" });
User.belongsTo(Organization, { foreignKey: "orgId", as: "org" });

Organization.hasMany(Project, { foreignKey: "orgId", as: "projects" });
Project.belongsTo(Organization, { foreignKey: "orgId", as: "org" });

Organization.hasMany(Task, { foreignKey: "orgId", as: "tasks" });
Task.belongsTo(Organization, { foreignKey: "orgId", as: "org" });

User.hasMany(Task, { foreignKey: "assigneeId", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assigneeId", as: "assignee" });

User.hasMany(Task, { foreignKey: "createdById", as: "createdTasks" });
Task.belongsTo(User, { foreignKey: "createdById", as: "createdBy" });

Project.hasMany(Task, { foreignKey: "projectId", as: "tasks" });
Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });

User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { Organization, User, Project, Task, RefreshToken };
