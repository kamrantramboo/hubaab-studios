'use client';

/**
 * This route responsible for the Sanity Studio
 * which is embedded into the Next.js app.
 */

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function AdminPage() {
  return <NextStudio config={config} />;
}
