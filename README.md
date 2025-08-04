# Babu Shoes API - Cloudinary Image Upload Implementation

This NestJS application has been enhanced with Cloudinary image uploading functionality that supports color-based image organization for products.

## Features

- **Color-based Image Upload**: Upload multiple images for specific colors (optional)
- **Product Creation with Color Images**: Create products with or without organized color-based image collections
- **Cloudinary Integration**: Secure cloud storage for all uploaded images
- **MongoDB Storage**: Persistent storage of product data with optional color image associations

## Architecture

### Database Schema Changes

The product schema has been updated to include a `colors` array:

```typescript
interface ProductColorImage {
  color: string;
  urls: string[];
}

interface Product {
  // ... existing fields
  colors: ProductColorImage[];
}
```

### API Endpoints

#### 1. Upload Images for a Color

- **Endpoint**: `POST /upload/images`
- **Content-Type**: `multipart/form-data`
- **Purpose**: Upload multiple images for a specific color

**Request Body:**

```
color: "blue"
images: [file1, file2, file3, ...] (max 10 files)
```

**Response:**

```json
{
  "color": "blue",
  "urls": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/image1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/image2.jpg"
  ]
}
```

#### 2. Create Product with Color Images

- **Endpoint**: `POST /products`
- **Content-Type**: `application/json`
- **Purpose**: Create a product with optional associated color images

**Request Body:**

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

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# MongoDB Configuration
MONGODB_URI=mongodb+srv://iftekharahmedxyz:helloworld@cluster0.uleqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 3. Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Replace the placeholder values in your `.env` file

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm run start:prod
```

## Usage Workflow

### Step 1: Upload Images for Colors (Optional)

1. Use the `/upload/images` endpoint to upload images for each color
2. Store the returned URLs for use in product creation

### Step 2: Create Product with Color Images

1. Use the `/products` endpoint to create a product
2. Optionally include the color image URLs from step 1 in the `colors` array
3. Products can be created without any color images

## File Structure

```
src/products/
├── controllers/
│   ├── products.controller.ts
│   └── image-upload.controller.ts
├── services/
│   ├── products.service.ts
│   └── cloudinary.service.ts
├── dto/
│   ├── create-product.dto.ts
│   └── upload-images.dto.ts
├── schemas/
│   ├── product.schema.ts
│   └── product-color-image.schema.ts
└── entities/
    └── product.entity.ts
```

## Testing

Run the test script to verify the implementation:

```bash
node test-api.js
```

## Key Components

### CloudinaryService

Handles all image upload operations to Cloudinary:

- `uploadImage()`: Upload single image
- `uploadMultipleImages()`: Upload multiple images
- `deleteImage()`: Delete image from Cloudinary

### ImageUploadController

Manages image upload endpoints:

- Validates file uploads
- Handles color-based organization
- Returns structured response with URLs

### Product Schema Updates

- Added `colors` field as array of `ProductColorImage`
- Each color contains color name and array of image URLs

## Error Handling

The implementation includes comprehensive error handling:

- File upload validation
- Cloudinary upload error handling
- Database operation error handling
- Input validation using class-validator

## Security Features

- File type validation
- File size limits (configurable)
- Maximum file count limits
- Secure Cloudinary integration
- Input sanitization

## Future Enhancements

- Image compression and optimization
- Multiple image format support
- Image transformation capabilities
- Bulk upload operations
- Image deletion endpoints
- Color validation and standardization
