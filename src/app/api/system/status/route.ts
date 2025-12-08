// src/app/api/system/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isMaintenanceMode, setMaintenanceMode } from '@/lib/maintenance';
import { revalidatePath } from 'next/cache'; // <--- IMPORT THIS

const CONTROL_KEY = process.env.KEY; 

export async function GET() {
  try {
    const maintenance = await isMaintenanceMode();
    // Prevent caching of the status check itself
    return NextResponse.json({ maintenance }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ maintenance: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, key } = body;

    if (!key || key !== CONTROL_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'enable') {
      await setMaintenanceMode(true);
      
      // FORCE REFRESH: Tell Next.js to rebuild the layout immediately
      revalidatePath('/', 'layout'); 
      
      return NextResponse.json({ success: true, maintenance: true });

    } else if (action === 'disable') {
      await setMaintenanceMode(false);
      
      // FORCE REFRESH
      revalidatePath('/', 'layout'); 

      return NextResponse.json({ success: true, maintenance: false });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
