import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'restaurant',
  title: 'Restaurant',
  type: 'document',
  fields: [
    {
      name: "name",
      type: 'string',
      title: 'Restaurant name',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      type: 'string',
      title: 'Restaurant description',
      validation: (Rule) => Rule.max(100),
    },
    {
      name: "image",
      type: 'image',
      title: 'Restaurant image',
    },
    {
      name: "location",
      type: 'string',
      title: 'Restaurant location',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "timing",
      type: 'string',
      title: 'Restaurant timing',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "genre",
      type: 'string',
      title: 'Restaurant food genre',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "dishes",
      type: 'array',
      title: 'Dishes',
      of: [{type: 'reference', to: [{type: 'dish'}] }],
    },
    {
      name: "Veg_NonVeg",
      type: 'string',
      title: 'Is the restaurant veg or non-veg?',
      validation: (Rule) => Rule.max(100),
    },
    {
      name: "CostForTwo",
      type: 'string',
      title: 'Approxiamate cost to fill two people',
      validation: (Rule) => Rule.max(100),
    },
    {
      name: "RestaurantPhone",
      type: 'string',
      title: 'Restaurant Phone Number',
      validation: (Rule) => Rule.max(100),
    },
  ]
})
