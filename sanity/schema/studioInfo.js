const studioInfoSchema = {
  name: 'studioInfo',
  title: 'Studio Info',
  type: 'document',
  fields: [
    {
      name: 'intro',
      title: 'Studio Intro',
      type: 'text',
    },
    {
      name: 'services',
      title: 'Services Offered',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'clients',
      title: 'Featured Clients',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'industry',
      title: 'Industries',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'press',
      title: 'Press Mentions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'publication', type: 'string', title: 'Publication' },
            { name: 'title', type: 'string', title: 'Article Title' },
            { name: 'url', type: 'url', title: 'URL' }
          ]
        }
      ]
    }
  ],
}

export default studioInfoSchema;
