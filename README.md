# Vue-Cloudinary-Image

Responsive image component

Uses the image attributes srcSet and sizes to responsively display an an image from cloudinary.

Generates srcSet with a placeholder for lazyloading based on screen sizes passed in options and adjusts the sizes attribute depending on the screen size.

## Installation

```shell
// yarn
yarn add @teamnovu/vue-cloudinary-image

// npm
npm i @teamnovu/vue-cloudinary-image
```

## Setup

```javascript
import CloudinaryImage from '@teamnovu/vue-cloudinary-image'

Vue.use(CloudinaryImage, {
  cloudinaryBaseUrl: "https://res.cloudinary.com/<your-cloud-name>/image/upload/",
});
```

## Usage

```html
<CloudinaryImage src="/assets/image.jpg" />
```

## Plugin Options

| Option                    | Default                                             | Required | Type   | Comment |
| ------------------------- | --------------------------------------------------- | -------- | ------ | ------- |
| cloudinaryBaseUrl         | null                                                | true     | String |         |
| screenSizes               | [default screen sizes](src/default-screen-sizes.js) | false    | Object |         |
| placeholderTransformation | null                                                | false    | String | Named Transformation used for the placeholder transformation |

## Attributes

| Attribute          | Default | Required | Type    | Description                                                                                                                                                                                                      |
| ------------------ | ------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src                | null    | true     | String  | Relative path to image from cloudinaryAssetUrl                                                                                                                                                                   |
| quality            | 85      | false    | Number  | Cloudinary Option                                                                                                                                                                                                     |
| blur               | null    | false    | Number  | Cloudinary Option                                                                                                                                                                                                     |
| crop               | null    | false    | String  | Cloudinary Option                                                                                                                                                                                                     |
| format             | 'auto'    | false    | String  | Cloudinary Option                                                                                                                                                                                                     |
| fallbackWidth      | null    | false    | Number  | If srcSet and sizes are not supported in the clients browser, this will be the fixed width of the image itself (not css width)                                                                                   |  |
| aspectRatio        | null    | false    | Number  | If you set this attribute the component will ignore the placeholderDataUrl attribute and load the placeholder image from cloudinary because the aspect ratio would change between placeholder and the real image |
| placeholderDataUrl | null    | false    | String  | If this attribute is set all other placeholder options are ignored and this url is used as the placeholder source                                                                                              |
| placeholderQuality | 30      | false    | Number  | Cloudinary Option                                                                                                                                                                                                     |
| placeholderWidth   | 300     | false    | Number  | Cloudinary Option                                                                                                                                                                                                     |
| usePlaceholder     | true    | false    | Boolean | If this attribute is set to false, no placeholder will be displayed and the original image will be rendered immediately                                                                                          |

## Example

```html
<CloudinaryImage
  src="/assets/image.jpg"
/>
```
