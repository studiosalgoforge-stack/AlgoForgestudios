// src/lib/maintenance.ts

import SystemSetting from '@/models/SystemSetting';
import connectDB from './db';

export async function isMaintenanceMode(): Promise<boolean> {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: 'maintenance_mode' });
    return setting ? setting.value : false;
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return false; // Fail safe: if DB fails, keep site open
  }
}

export async function getMaintenanceInfo() {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: 'maintenance_mode' });
    
    return {
      enabled: setting ? setting.value : false,
      enabledAt: setting ? setting.updatedAt : null
    };
  } catch (error) {
    return {
      enabled: false,
      enabledAt: null
    };
  }
}

export async function setMaintenanceMode(enabled: boolean) {
  try {
    await connectDB();
    await SystemSetting.findOneAndUpdate(
      { key: 'maintenance_mode' },
      { 
        key: 'maintenance_mode',
        value: enabled,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    return true;
  } catch (error) {
    console.error('Error setting maintenance mode:', error);
    throw new Error('Failed to update maintenance mode in database');
  }
}