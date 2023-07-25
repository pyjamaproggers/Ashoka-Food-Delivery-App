import {createClient} from '@sanity/client'
import imageURLBuilder from '@sanity/image-url'
const client = createClient({
    projectId: '6056n8y8',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2021-10-21', // use current date (YYYY-MM-DD) to target the latest API version
    // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
  })

const builder = imageURLBuilder(client);
export const urlFor = (source) => builder.image(source);

export default client;

   