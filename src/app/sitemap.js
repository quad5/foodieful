import { MetadataRoute } from 'next'

export default function sitemap() {
    return [
        {
            url: 'https://www.foodieful.net',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://www.foodieful.net/create-vendor',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: 'https://www.foodieful.net/faq',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: 'https://www.foodieful.net/vendor',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: 'https://www.foodieful.net/vendor/listing',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7,
        },
        {
            url: 'https://www.foodieful.net/vendorProfile',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: 'https://www.foodieful.net/userProfile',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ]
}