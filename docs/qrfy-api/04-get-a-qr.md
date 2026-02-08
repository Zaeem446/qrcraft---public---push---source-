# QRFY API - Get a QR

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `GET`

**URL:** `/api/public/qrs/{id}`

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | **Required** - ID of QR to return |

## Responses

### 200 OK

| Parameter | Type |
|-----------|------|
| id | integer |
| name | string |
| accessPassword | boolean |
| status | boolean |
| folder | object or null |
| stopped | boolean |
| uri | string or null |
| type | string - `app`, `business`, `coupon`, `feedback`, `images`, `link-list`, `menu`, `mp3`, `pdf`, `sms`, `text`, `url`, `url-static`, `vcard`, `vcard-plus`, `video`, `whatsapp`, `wifi`, `social`, `email`, `barcode` |
| data | object (varies by type: AppResponse, BusinessResponse, CouponResponse, EmailBody, EventResponse, FeedbackResponse, ImagesResponse, LinkListResponse, MenuResponse, Mp3Response, PdfResponse, SmsBody, SocialResponse, TextBody, UrlBody, VcardBody, VcardPlusResponse, VideoResponse, UrlStaticBody, WhatsappBody, WifiBody, BarcodeBody) |
| createdAt | integer |
| updatedAt | integer |
| raw | string |
| style | object |
| finalUrl | string |
| scans | integer |
| scanLimit | integer or null (1..10000000) |
| googleAnalyticsId | string |
| facebookPixelId | string |
| googleTagManagerId | string |
| favorite | boolean |
| hostname | string |

### Response Sample

```json
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
```

### Error Responses

- **401** - Invalid API key
- **404** - Resource not found
