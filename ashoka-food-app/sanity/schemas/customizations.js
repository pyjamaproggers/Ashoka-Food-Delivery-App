import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'Customization',
  title: 'Customization',
  type: 'document',
  fields: [
    {
      name: "name",
      type: 'string',
      title: 'Name of Customization',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "Price",
      type: 'number',
      title: 'Price of the dish in INR',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "Veg_NonVeg",
      type: 'string',
      title: 'Is the Dish Veg or Non Veg',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "ofDish",
      type: 'string',
      title: 'Which dish is the customization for?',
      validation: (Rule) => Rule.required(),
    },
    {
        name: "Genre",
        type: 'string',
        title: 'Genre of the Customization',
        validation: (Rule) => Rule.required(),
    },
    {
        name: "Required",
        type: 'string',
        title: 'Is it required?',
        validation: (Rule) => Rule.required(),
    },
  ]
})
