# QRFY API - Bulk Edit

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `PUT`

**URL:** `/api/public/qrs`

**Content-Type:** `application/json`

## Request Body Schema

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| style | object | - | Style applied to all qrs |
| folder | integer or null | 1 | Folder ID, assign a user folder to the qr |
| qrs | array of object | - | **Required** |

## Responses

### 200 OK

Returns array of QR objects.

### Response Sample

```json
[
  {
    "id": 0,
    "name": "string",
    "accessPassword": true,
    "status": true,
    "folder": {
      "name": "string",
      "id": 0
    },
    "stopped": true,
    "uri": "string",
    "type": "string",
    "data": {
      "name": "string",
      "developer": "string",
      "logo": "https://qrfy.com/QRFY_logo.svg",
      "description": "string",
      "apps": {
        "iphone": "string",
        "android": "string",
        "amazon": "string"
      },
      "preview": "https://qrfy.com/QRFY_logo.svg",
      "design": {
        "primary": "#FF0000",
        "secondary": "#FF0000"
      }
    },
    "createdAt": 1693257323,
    "updatedAt": 1693257323,
    "raw": "string",
    "style": {
      "image": "https://qrfy.com/QRFY_logo.svg",
      "shape": {
        "backgroundColor": {
          "type": "string",
          "rotation": null,
          "colorStops": [
            {
              "offset": 0,
              "color": "#FF0000"
            }
          ]
        },
        "color": {
          "type": "string",
          "rotation": null,
          "colorStops": [
            {
              "offset": 0,
              "color": "#FF0000"
            }
          ]
        },
        "style": "string"
      },
      "corners": {
        "squareStyle": "string",
        "dotStyle": "string",
        "dotColor": {
          "type": "string",
          "rotation": null,
          "colorStops": [
            {
              "offset": 0,
              "color": "#FF0000"
            }
          ]
        },
        "squareColor": {
          "type": "string",
          "rotation": null,
          "colorStops": [
            {
              "offset": 0,
              "color": "#FF0000"
            }
          ]
        }
      },
      "frame": {
        "id": 0,
        "color": {
          "type": "string",
          "rotation": null,
          "colorStops": [
            {
              "offset": 0,
              "color": "#FF0000"
            }
          ]
        },
        "text": "string",
        "fontSize": 0,
        "backgroundColor": {
          "type": "string",
          "rotation": null,
          "colorStops": [
            {
              "offset": 0,
              "color": "#FF0000"
            }
          ]
        },
        "textColor": "#FF0000"
      },
      "errorCorrectionLevel": "string"
    },
    "finalUrl": "string",
    "scans": 0,
    "scanLimit": 0,
    "googleAnalyticsId": "G-ABCDEFGHIJ",
    "facebookPixelId": "12345678910",
    "googleTagManagerId": "GTM-ABCDEFGHIJ",
    "favorite": true,
    "hostname": "string"
  }
]
```

### Error Responses

- **400** - Validation Failed
- **401** - Invalid API key
- **404** - Not Found
