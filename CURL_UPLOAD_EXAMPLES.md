# cURL Photo Upload Examples

## Basic Photo Upload for a Color

### Single Image Upload

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/path/to/your/image.jpg"
```

### Multiple Images Upload (Up to 10 images)

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=red" \
  -F "images=@/path/to/red-shoe-1.jpg" \
  -F "images=@/path/to/red-shoe-2.jpg" \
  -F "images=@/path/to/red-shoe-3.jpg"
```

## Different Color Examples

### Blue Color Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/path/to/blue-shoe-front.jpg" \
  -F "images=@/path/to/blue-shoe-side.jpg" \
  -F "images=@/path/to/blue-shoe-back.jpg"
```

### Black Color Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=black" \
  -F "images=@/path/to/black-shoe-1.jpg" \
  -F "images=@/path/to/black-shoe-2.jpg"
```

### White Color Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=white" \
  -F "images=@/path/to/white-shoe.jpg"
```

## Different Image Formats

### JPG Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=green" \
  -F "images=@/path/to/green-shoe.jpg"
```

### PNG Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=yellow" \
  -F "images=@/path/to/yellow-shoe.png"
```

### WebP Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=purple" \
  -F "images=@/path/to/purple-shoe.webp"
```

## Real-World Examples

### Nike Air Max - Blue Color

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/images/nike-airmax-blue-front.jpg" \
  -F "images=@/images/nike-airmax-blue-side.jpg" \
  -F "images=@/images/nike-airmax-blue-back.jpg" \
  -F "images=@/images/nike-airmax-blue-sole.jpg"
```

### Adidas Ultraboost - Red Color

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=red" \
  -F "images=@/images/adidas-ultraboost-red-front.jpg" \
  -F "images=@/images/adidas-ultraboost-red-side.jpg" \
  -F "images=@/images/adidas-ultraboost-red-back.jpg"
```

### Puma RS-X - Black Color

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=black" \
  -F "images=@/images/puma-rsx-black-front.jpg" \
  -F "images=@/images/puma-rsx-black-side.jpg"
```

## Expected Response

All upload requests will return a JSON response like this:

```json
{
  "color": "blue",
  "urls": [
    "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/babu-shoes/blue-shoe-1.jpg",
    "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/babu-shoes/blue-shoe-2.jpg",
    "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/babu-shoes/blue-shoe-3.jpg"
  ]
}
```

## Error Examples

### Missing Color Parameter

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "images=@/path/to/image.jpg"
```

**Response:**

```json
{
  "statusCode": 400,
  "message": "Color is required"
}
```

### No Images Provided

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue"
```

**Response:**

```json
{
  "statusCode": 400,
  "message": "No images provided"
}
```

### Invalid File Path

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/path/to/nonexistent-file.jpg"
```

**Response:**

```json
{
  "statusCode": 400,
  "message": "Failed to upload images"
}
```

## Complete Workflow Example

### Step 1: Upload Blue Color Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/images/blue-shoe-1.jpg" \
  -F "images=@/images/blue-shoe-2.jpg"
```

### Step 2: Upload Red Color Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=red" \
  -F "images=@/images/red-shoe-1.jpg" \
  -F "images=@/images/red-shoe-2.jpg"
```

### Step 3: Create Product with Uploaded Images

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Air Max 270",
    "image": "https://example.com/main-image.jpg",
    "price": 199.99,
    "categoryId": "507f1f77bcf86cd799439011",
    "articleNo": "NIKE-AM-270",
    "colors": [
      {
        "color": "blue",
        "urls": [
          "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/babu-shoes/blue-shoe-1.jpg",
          "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/babu-shoes/blue-shoe-2.jpg"
        ]
      },
      {
        "color": "red",
        "urls": [
          "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/babu-shoes/red-shoe-1.jpg",
          "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/babu-shoes/red-shoe-2.jpg"
        ]
      }
    ]
  }'
```

## Tips for cURL Uploads

1. **File Paths**: Use absolute paths or correct relative paths to your image files
2. **File Formats**: Supported formats include JPG, PNG, WebP, GIF
3. **File Size**: Keep images under 10MB for optimal performance
4. **Color Names**: Use descriptive color names (e.g., "navy-blue", "light-gray")
5. **Multiple Files**: You can upload up to 10 images per color
6. **Response**: Save the returned URLs for use in product creation

## Testing with Sample Images

If you don't have actual images, you can test with placeholder images:

```bash
# Download a sample image first
curl -o test-image.jpg https://via.placeholder.com/300x200/0066cc/ffffff?text=Test+Image

# Then upload it
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@test-image.jpg"
```
