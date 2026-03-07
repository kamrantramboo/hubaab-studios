import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // For server-side mutations (like inquiry submissions)
};

export const sanityClient = createClient(config);

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

// Helper to fetch data
export async function sanityFetch({ query, params = {} }) {
  return sanityClient.fetch(query, params);
}
