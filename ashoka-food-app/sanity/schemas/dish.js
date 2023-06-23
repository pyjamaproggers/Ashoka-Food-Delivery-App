import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'dish',
  title: 'Dish',
  type: 'document',
  fields: [
    {
      name: "name",
      type: 'string',
      title: 'Name of dish',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "Menu_category",
      type: 'string',
      title: 'Cuisine or category the dish is a part of. Example, Starters or Main Course or Chinese or Indian etc',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: "Price",
      type: 'string',
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
      name: "image",
      type: 'image',
      title: 'Dish Image',
    }, 
  ]
})
