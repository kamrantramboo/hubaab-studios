const projectSchema = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'client',
      title: 'Client',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'Cinematic'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'text',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'media',
      title: 'Media Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    },
    {
      name: 'videoUrl',
      title: 'Video URL (Vimeo/YouTube)',
      type: 'url',
    },
    {
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'is_vertical',
      title: 'Is Vertical Video?',
      type: 'boolean',
      initialValue: false,
      description: 'Enable for portrait/mobile format videos'
    },
    {
      name: 'video_alignment',
      title: 'Video Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Center', value: 'center center' },
          { title: 'Top', value: 'center top' },
          { title: 'Bottom', value: 'center bottom' },
          { title: 'Left', value: 'left center' },
          { title: 'Right', value: 'right center' },
        ],
      },
      initialValue: 'center center',
      description: 'Control how the video is positioned within its container'
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0
    }
  ],
}

export default projectSchema;
