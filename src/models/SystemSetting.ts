// src/models/SystemSetting.ts
import mongoose, { Schema, model, models } from 'mongoose';

const SystemSettingSchema = new Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true 
  },
  value: { 
    type: Boolean, 
    default: false 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const SystemSetting = models.SystemSetting || model('SystemSetting', SystemSettingSchema);

export default SystemSetting;