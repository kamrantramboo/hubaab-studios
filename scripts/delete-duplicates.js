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

async function run() {
  const query = `*[_type == "project"] | order(_createdAt asc) { _id, title }`;
  const docs = await client.fetch(query);
  
  const seenTitles = new Set();
  const toDelete = [];
  
  for (const doc of docs) {
    if (seenTitles.has(doc.title)) {
      toDelete.push(doc._id);
    } else {
      seenTitles.add(doc.title);
    }
  }
  
  console.log(`Found ${toDelete.length} duplicates to delete.`);
  for (const id of toDelete) {
    console.log(`Deleting ${id}...`);
    await client.delete(id);
  }
  console.log('Done!');
}

run();
