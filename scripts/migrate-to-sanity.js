const { createClient } = require('@sanity/client');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

const data = JSON.parse(fs.readFileSync('supabase_data.json', 'utf8'));

async function uploadImage(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(url),
    });
    return asset._id;
  } catch (error) {
    console.error(`Failed to upload image: ${url}`, error.message);
    return null;
  }
}

async function migrate() {
  console.log('Starting migration...');

  // 1. Studio Info
  console.log('Migrating Studio Info...');
  await client.createOrReplace({
    _id: 'studioInfo',
    _type: 'studioInfo',
    ...data.studioInfo,
  });

  // 2. Careers
  console.log('Migrating Careers...');
  for (const career of data.careers) {
    await client.create({
      _type: 'career',
      title: career.title,
      slug: { _type: 'slug', current: career.slug },
      type: career.type,
      description: career.description,
      active: career.active,
    });
  }

  // 3. Inquiries
  console.log('Migrating Inquiries...');
  for (const inquiry of data.inquiries) {
    await client.create({
      _type: 'inquiry',
      ...inquiry,
    });
  }

  // 4. Projects
  console.log('Migrating Projects...');
  for (const project of data.projects) {
    console.log(`Migrating project: ${project.title}`);
    let thumbnailId = null;
    if (project.thumbnailUrl) {
      thumbnailId = await uploadImage(project.thumbnailUrl);
    }

    await client.create({
      _type: 'project',
      title: project.title,
      client: project.client,
      slug: { _type: 'slug', current: project.slug },
      category: project.category,
      description: project.description,
      services: project.services,
      videoUrl: project.videoUrl,
      featured: project.featured,
      sortOrder: project.sortOrder,
      is_vertical: project.isVertical,
      video_alignment: project.videoAlignment,
      thumbnail: thumbnailId ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: thumbnailId,
        },
      } : undefined,
    });
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
