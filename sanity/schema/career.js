export default {
  name: 'career',
  title: 'Career',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Role Title',
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
      name: 'type',
      title: 'Job Type',
      type: 'string',
      initialValue: 'Freelance / Contract'
    },
    {
      name: 'description',
      title: 'Job Description',
      type: 'text',
    },
    {
      name: 'active',
      title: 'Active / Open',
      type: 'boolean',
      initialValue: true
    }
  ],
}
