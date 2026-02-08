# QRFY API - List QRs

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `GET`

**URL:** `/api/public/qrs`

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number |
| sortBy | string | Sort field: `name`, `created_at`, `updated_at`, `scans`. DESC direction except for 'name' |
| folder | integer | Folder ID |
| types | array of string | Filter by QR type. Values: `app`, `business`, `coupon`, `feedback`, `images`, `link-list`, `menu`, `mp3`, `pdf`, `sms`, `text`, `url`, `url-static`, `vcard`, `vcard-plus`, `video`, `whatsapp`, `wifi`, `social`, `email`, `barcode` |
| status | string | QR status: `active`, `soft-deleted`, `stopped`, `blocked` |
| searchTerm | string | Search term name |

## Responses

### 200 OK

| Parameter | Type |
|-----------|------|
| pages | integer |
| total | integer |
| data | array of object |

### Response Sample

```json
{
  "pages": 0,
  "total": 0,
  "data": [
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
            "colorStops": [{ "offset": 0, "color": "#FF0000" }]
          },
          "color": {
            "type": "string",
            "rotation": null,
            "colorStops": [{ "offset": 0, "color": "#FF0000" }]
          },
          "style": "string"
        },
        "corners": {
          "squareStyle": "string",
          "dotStyle": "string",
          "dotColor": {
            "type": "string",
            "rotation": null,
            "colorStops": [{ "offset": 0, "color": "#FF0000" }]
          },
          "squareColor": {
            "type": "string",
            "rotation": null,
            "colorStops": [{ "offset": 0, "color": "#FF0000" }]
          }
        },
        "frame": {
          "id": 0,
          "color": {
            "type": "string",
            "rotation": null,
            "colorStops": [{ "offset": 0, "color": "#FF0000" }]
          },
          "text": "string",
          "fontSize": 0,
          "backgroundColor": {
            "type": "string",
            "rotation": null,
            "colorStops": [{ "offset": 0, "color": "#FF0000" }]
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
}
```

### Error Responses

- **401** - Invalid API key
