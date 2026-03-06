export default {
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'services',
      title: 'Services Requested',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
    },
    {
      name: 'industry',
      title: 'Industry',
      type: 'string',
    },
    {
      name: 'projectDescription',
      title: 'Project Description',
      type: 'text',
    },
    {
      name: 'budget',
      title: 'Budget',
      type: 'string',
    },
    {
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Archived', value: 'archived' }
        ]
      }
    }
  ],
  readOnly: true // Inquiries should mostly be read in the dashboard
}
