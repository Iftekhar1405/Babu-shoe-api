# Cloudinary Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# MongoDB Configuration
MONGODB_URI=mongodb+srv://iftekharahmedxyz:helloworld@cluster0.uleqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## Getting Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Replace the placeholder values in your `.env` file

## API Endpoints

### Upload Images for a Color

- **POST** `/upload/images`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `color`: string (required)
  - `images`: array of files (required, max 10)

**Example Response:**

```json
{
  "color": "blue",
  "urls": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/image1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/image2.jpg"
  ]
}
```

### Create Product with Color Images

- **POST** `/products`
- **Content-Type**: `application/json`
- **Body** (colors field is optional):

```json
{
  "name": "Nike Air Max",
  "image": "https://example.com/main-image.jpg",
  "price": 199.99,
  "categoryId": "category-id",
  "articleNo": "NIKE-001",
  "colors": [
    {
      "color": "blue",
      "urls": [
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-image1.jpg",
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-image2.jpg"
      ]
    },
    {
      "color": "red",
      "urls": [
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-image1.jpg"
      ]
    }
  ]
}
```

### Create Product Without Color Images

```json
{
  "name": "Nike Air Max",
  "image": "https://example.com/main-image.jpg",
  "price": 199.99,
  "categoryId": "category-id",
  "articleNo": "NIKE-001"
  // Note: colors field is optional and can be omitted
}
```
