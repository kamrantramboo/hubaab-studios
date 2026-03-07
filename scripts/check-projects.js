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

async function checkProjects() {
  const query = `*[_type == "project" && featured == true] | order(sortOrder asc) {
    _id,
    title,
    client,
    slug
  }`;
  
  const docs = await client.fetch(query);
  console.log(`Found ${docs.length} featured projects:`);
  docs.forEach(d => console.log(`- ${d.title} (${d._id})`));
}

checkProjects();
