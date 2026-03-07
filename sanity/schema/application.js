const applicationSchema = {
  name: 'application',
  title: 'Job Applications',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'roleTitle',
      title: 'Role Applied For',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'portfolioUrl',
      title: 'Portfolio URL',
      type: 'url'
    },
    {
      name: 'resumeUrl',
      title: 'Resume/CV URL',
      type: 'url'
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Reviewing', value: 'reviewing' },
          { title: 'Interviewing', value: 'interviewing' },
          { title: 'Hired', value: 'hired' },
          { title: 'Rejected', value: 'rejected' }
        ]
      },
      initialValue: 'new'
    },
    {
      name: 'createdAt',
      title: 'Applied At',
      type: 'datetime',
      initialValue: (new Date()).toISOString()
    }
  ]
}

export default applicationSchema;
