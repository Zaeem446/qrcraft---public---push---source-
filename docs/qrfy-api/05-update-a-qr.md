# QRFY API - Update a QR

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `PUT`

**URL:** `/api/public/qrs/{id}`

**Content-Type:** `application/json`

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | **Required** |

## Request Body Schema

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| name | string (<= 100 characters) | QR example | - |
| folder | integer or null | 1 | Folder ID, assign a user folder to the qr |
| type | string | - | `app`, `business`, `coupon`, `feedback`, `images`, `link-list`, `menu`, `mp3`, `pdf`, `sms`, `text`, `url`, `url-static`, `vcard`, `vcard-plus`, `video`, `whatsapp`, `wifi`, `social`, `email`, `barcode` |
| data | object | - | AppEditBody, BusinessEditBody, CouponEditBody, EmailBody, EventEditBody, FeedbackEditBody, ImagesEditBody, LinkListEditBody, MenuEditBody, Mp3EditBody, PdfEditBody, SmsBody, TextBody, UrlBody, UrlStaticBody, VideoEditBody, VcardBody, VcardPlusEditBody, WifiBody, WhatsappBody, BarcodeBody |
| style | object | - | - |
| accessPassword | string (>= 3 characters) | - | QR password. Empty string will disable the current password |
| googleAnalyticsId | string | G-ABCDEFGHIJ | Google Analytics 4 Tracking ID to track the QR page traffic |
| facebookPixelId | string | 12345678910 | Facebook Pixel ID to track the QR page traffic |
| googleTagManagerId | string | GTM-ABCDEFGHIJ | Google Tag Manager ID |
| hostname | string | - | Subdomain |
| scanLimit | integer or null (1..10000000) | - | - |

## Responses

### 200 OK

| Parameter | Type |
|-----------|------|
| id | integer |
| raw | string |

### Response Sample

```json
{
  "id": 0,
  "raw": "string"
}
```

### Error Responses

- **401** - Invalid API key
- **404** - Not Found
- **409** - Conflict - Cannot switch between dynamic/static qr types
