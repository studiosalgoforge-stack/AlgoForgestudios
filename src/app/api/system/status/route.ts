// src/app/api/system/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isMaintenanceMode, setMaintenanceMode } from '@/lib/maintenance';

// Ensure you have this environment variable set in Vercel/Production!
const CONTROL_KEY = process.env.KEY; 

export async function GET() {
  try {
    // Check DB instead of file system
    const maintenance = await isMaintenanceMode();
    return NextResponse.json({ maintenance });
  } catch (error) {
    console.error('Maintenance API GET error:', error);
    // Default to false if DB check fails to avoid locking everyone out
    return NextResponse.json({ maintenance: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, key } = body;

    // Security Check
    if (!key || key !== CONTROL_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    if (action === 'enable') {
      // Write TRUE to Database
      await setMaintenanceMode(true);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Maintenance mode enabled',
        maintenance: true 
      });

    } else if (action === 'disable') {
      // Write FALSE to Database
      await setMaintenanceMode(false);

      return NextResponse.json({ 
        success: true, 
        message: 'Maintenance mode disabled',
        maintenance: false 
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "enable" or "disable"' }, 
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Maintenance API POST error:', error);
    return NextResponse.json(
      { error: 'Server error updating maintenance mode' }, 
      { status: 500 }
    );
  }
}