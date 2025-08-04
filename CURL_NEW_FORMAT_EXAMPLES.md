# New Format cURL Examples for Image Upload

## Overview

The new image upload format allows you to:

1. Specify an array of color names
2. Upload images for each color using the color name as the field key
3. Only process colors that are present in the colors array

## Format Structure

```
colors: ['red', 'navy_blue']
'red': [img1, img2, img3]
'navy_blue': [img1, img2]
```

## API Endpoints

### 1. `/upload/images-v2` - Using FilesInterceptor with indices (Recommended)

- Supports ANY color names (fully flexible)
- Uses file indices to map files to colors
- More reliable and flexible

### 2. `/upload/images-v3` - Using FilesInterceptor with indices (Alternative)

- Supports any color names
- Uses file indices to map files to colors
- Same functionality as v2

## cURL Examples

### Example 1: Upload Images for Red and Blue Colors (v2)

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['red', 'blue']" \
  -F "red=[0, 1]" \
  -F "blue=[2, 3, 4]" \
  -F "files=@/path/to/red-shoe-1.jpg" \
  -F "files=@/path/to/red-shoe-2.jpg" \
  -F "files=@/path/to/blue-shoe-1.jpg" \
  -F "files=@/path/to/blue-shoe-2.jpg" \
  -F "files=@/path/to/blue-shoe-3.jpg"
```

### Example 2: Upload Images for Red and Navy Blue Colors (v2)

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['red', 'navy_blue']" \
  -F "red=[0, 1]" \
  -F "navy_blue=[2, 3]" \
  -F "files=@/path/to/red-shoe-1.jpg" \
  -F "files=@/path/to/red-shoe-2.jpg" \
  -F "files=@/path/to/navy-shoe-1.jpg" \
  -F "files=@/path/to/navy-shoe-2.jpg"
```

### Example 3: Upload Images with File Indices (v3)

```bash
curl -X POST http://localhost:3000/upload/images-v3 \
  -F "colors=['red', 'navy_blue']" \
  -F "red=[0, 1]" \
  -F "navy_blue=[2, 3, 4]" \
  -F "files=@/path/to/red-shoe-1.jpg" \
  -F "files=@/path/to/red-shoe-2.jpg" \
  -F "files=@/path/to/navy-shoe-1.jpg" \
  -F "files=@/path/to/navy-shoe-2.jpg" \
  -F "files=@/path/to/navy-shoe-3.jpg"
```

### Example 4: Single Color Upload (v2)

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['black']" \
  -F "black=@/path/to/black-shoe-1.jpg" \
  -F "black=@/path/to/black-shoe-2.jpg"
```

### Example 5: Multiple Colors with Different Image Counts (v2)

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['white', 'green', 'yellow']" \
  -F "white=@/path/to/white-shoe-1.jpg" \
  -F "green=@/path/to/green-shoe-1.jpg" \
  -F "green=@/path/to/green-shoe-2.jpg" \
  -F "yellow=@/path/to/yellow-shoe-1.jpg" \
  -F "yellow=@/path/to/yellow-shoe-2.jpg" \
  -F "yellow=@/path/to/yellow-shoe-3.jpg"
```

### Example 6: Color with No Images (v2)

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['red', 'blue', 'green']" \
  -F "red=[0]" \
  -F "blue=[1]"
  # Note: green has no images, will return empty array
```

### Example 7: Custom Color Names (v2)

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['custom_orange', 'metallic_silver', 'neon_pink']" \
  -F "custom_orange=[0, 1]" \
  -F "metallic_silver=[2]" \
  -F "neon_pink=[3, 4, 5]" \
  -F "files=@/path/to/custom-orange-1.jpg" \
  -F "files=@/path/to/custom-orange-2.jpg" \
  -F "files=@/path/to/metallic-silver-1.jpg" \
  -F "files=@/path/to/neon-pink-1.jpg" \
  -F "files=@/path/to/neon-pink-2.jpg" \
  -F "files=@/path/to/neon-pink-3.jpg"
```

### Example 8: Complex Color Names with Special Characters (v2)

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['dark-navy-blue', 'light_gray_metallic', 'red-orange-gradient']" \
  -F "dark-navy-blue=[0]" \
  -F "light_gray_metallic=[1, 2]" \
  -F "red-orange-gradient=[3, 4, 5]" \
  -F "files=@/path/to/dark-navy-1.jpg" \
  -F "files=@/path/to/light-gray-1.jpg" \
  -F "files=@/path/to/light-gray-2.jpg" \
  -F "files=@/path/to/gradient-1.jpg" \
  -F "files=@/path/to/gradient-2.jpg" \
  -F "files=@/path/to/gradient-3.jpg"
```

## Expected Response Format

```json
{
  "red": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-2.jpg"
  ],
  "navy_blue": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/navy-shoe-1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/navy-shoe-2.jpg"
  ]
}
```

## Error Examples

### Missing Colors Array

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "red=@/path/to/red-shoe-1.jpg"
```

**Response:**

```json
{
  "statusCode": 400,
  "message": "Colors array is required"
}
```

### Empty Colors Array

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=[]" \
  -F "red=@/path/to/red-shoe-1.jpg"
```

**Response:**

```json
{
  "statusCode": 400,
  "message": "Colors array is required"
}
```

### Color Not in Colors Array

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['red']" \
  -F "red=@/path/to/red-shoe-1.jpg" \
  -F "blue=@/path/to/blue-shoe-1.jpg"
```

**Response:** Only red images will be processed, blue will be ignored

## Supported Color Names (v2)

The v2 endpoint now supports **ANY color names** - fully flexible!

- ✅ Standard colors: red, blue, black, white, green, yellow, purple, orange, pink, brown, gray
- ✅ Custom colors: custom_orange, metallic_silver, neon_pink
- ✅ Complex names: dark-navy-blue, light_gray_metallic, red-orange-gradient
- ✅ Special characters: hyphens, underscores, spaces (in quotes)
- ✅ Any combination of letters, numbers, hyphens, underscores

## Complete Workflow Example

### Step 1: Upload Images for Multiple Colors

```bash
curl -X POST http://localhost:3000/upload/images-v2 \
  -F "colors=['red', 'navy_blue']" \
  -F "red=@/images/red-shoe-1.jpg" \
  -F "red=@/images/red-shoe-2.jpg" \
  -F "navy_blue=@/images/navy-shoe-1.jpg" \
  -F "navy_blue=@/images/navy-shoe-2.jpg"
```

### Step 2: Create Product with Uploaded Images

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
        "color": "red",
        "urls": [
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-1.jpg",
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-2.jpg"
        ]
      },
      {
        "color": "navy_blue",
        "urls": [
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/navy-shoe-1.jpg",
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/navy-shoe-2.jpg"
        ]
      }
    ]
  }'
```

## Tips

1. **Use v2 endpoint** for any color names (fully flexible and recommended)
2. **Use v3 endpoint** as alternative (same functionality)
3. **Colors array is required** - specify all colors you want to process
4. **Only colors in the array** will be processed
5. **Empty arrays** are returned for colors with no images
6. **Max 10 images** per color
7. **Supported formats**: JPG, PNG, WebP, GIF
8. **File indices** - Use [0, 1, 2] to map files to colors
9. **Any color name** - Supports custom, complex, and special character names
