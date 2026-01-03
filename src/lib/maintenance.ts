// src/lib/maintenance.ts

import SystemSetting from '@/models/SystemSetting';
import connectDB from './db';

export async function isserviceMode(): Promise<boolean> {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: 'service' });
    return setting ? setting.value : false;
  } catch (error) {
    console.error('Error checking service mode:', error);
    return false; // Fail safe: if DB fails, keep site open
  }
}

export async function getserviceInfo() {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key: 'service' });
    
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

export async function setserviceMode(enabled: boolean) {
  try {
    await connectDB();
    await SystemSetting.findOneAndUpdate(
      { key: 'service' },
      { 
        key: 'service',
        value: enabled,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    return true;
  } catch (error) {
    console.error('Error setting service mode:', error);
    throw new Error('Failed to update service mode in database');
  }
}