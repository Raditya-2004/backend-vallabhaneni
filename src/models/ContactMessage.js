import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize.js';

export class ContactMessage extends Model {}

ContactMessage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'contact_messages',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['email'] }],
  }
);


