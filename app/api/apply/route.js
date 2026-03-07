import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Add timestamp and exact type before sending to Sanity
    const doc = {
      _type: 'application',
      ...data,
      createdAt: new Date().toISOString(),
    };

    await sanityClient.create(doc);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error submitting application to Sanity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
