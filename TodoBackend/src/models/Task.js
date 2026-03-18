import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Task = sequelize.define(
  "Task",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    title: { type: DataTypes.STRING, allowNull: false },

    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isIn: [[1, 2]] },
    },

    done: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    user_id: { type: DataTypes.INTEGER, allowNull: false },
    //TODO add relationss
  },
  {
    tableName: "tasks",
    schema: "public",
    timestamps: false,
  }
);
