import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function clearClients() {
  console.log('Clearing clients array from Studio Info...');
  const studioInfo = await client.fetch(`*[_type == "studioInfo"][0]`);

  if (!studioInfo) {
    console.log('No Studio Info document found.');
    return;
  }

  // Set clients to an empty array so you can start fresh
  if (studioInfo.clients) {
    console.log('Current clients data:', JSON.stringify(studioInfo.clients, null, 2));
    await client
      .patch(studioInfo._id)
      .set({ clients: [] })
      .commit();
    console.log('Successfully cleared clients list! You can now edit it in Sanity.');
  } else {
    console.log('Clients list is already empty or does not exist.');
  }
}

async function run() {
  try {
    await clearClients();
    console.log('Done!');
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

run();
