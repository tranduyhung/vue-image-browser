# An Image Manager Component Built with VueJs

![](images/example-image-1.png)

A JavaScript Image Manager written in [VueJS](https://vuejs.org/) and styled with [Spectre.css](https://picturepan2.github.io/spectre/).

## Features
- Image Upload
- Local or Remote Image Search
- Delete Image
- Show arbitrary information about the image
- Lazy Load Images on scroll

## Usage

Install as npm package

```
UNDER DEVELOPMENT
```

`import` this as a component. You may also use this inside another Vue component.

```javascript
<template>

    <VueImageManager
        :images="images"
        allow-upload
        allow-delete
        enable-lazy-load>
    </VueImageManager>

</template>
<script>
import VueImageManager from '@tranduyhung/vue-image-manager'

export default {
    components: {
        VueImageManager,
    },
    data() {
        return {
            images: [
                {'id': 1, 'name': 'sunflower.jpg', 'url': '/images/sunflower.jpg'},
                {'id': 2, 'name': 'rose.jpg', 'url': '/images/rose.jpg'},
                {'id': 3, 'name': 'tulip.jpg', 'url': '/images/tulip.jpg'},
            ],
            imageFields: {
                'id': 'Image ID', 'name': 'File Name', 'url': 'Image Location'
            }
        }
    }
}
</script>

```

## Image Object

It is possible to upload an image to a specified API endpoint (`save-url`) via POST.
When an image is uploaded successfully, a 200 HTTP Status code response must be sent back from the server with a response JSON. After the image is uploaded successfully, a `uploaded` event will be generated and the response JSON will be passed with the event. Please see the example section below.

## Image Upload Response

![](images/example-image-2.png)

It is possible to upload an image to a specified API endpoint (`upload-url`) via POST.
When an image is uploaded successfully, a 200 HTTP Status code response must be sent back from the server with a response JSON. Please see the example section below.


## Options

| Parameter              | Type    | Default Value | Description                                                                                                                                                                                      |
|------------------------|---------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `images`               | Array   | `[]`          | An array containing the image objects. Each image object must contain `id`, `name` and `url` of the image                                                                                        |
| `allow-upload`         | Boolean | false         | (OPTIONAL) Whether or not to provide provision for image upload. If this is `true`, a `upload-url` must be provided.                                                                               |
| `upload-url`           | String  | /api/images   | Specify the URL endpoint for posting the uploaded images.                                                                                                                                        |
| `upload-request-headers`| Object  | `{}`          | (OPTIONAL) If you need to pass any additional HTTP headers, you may do so by providing the header names and values in this object                                                                |
| `upload-form-data`| Object  | `{}`          | (OPTIONAL) Add custom data to upload form.                                                                |
| `allow-delete`         | Boolean | false         | (OPTIONAL) Whether or not to provide a provision for deleting an image in Image Pane view. If this is true, delete button will be shown and a `delete` event will be generated                  |
| `captionable`          | Boolean | false         | (OPTIONAL) Whether or not to provide a provision for specifying the image caption after selecting an image. If this is true, a prompt will be shown for image caption when users select an image |
| `enable-lazy-load`     | Boolean | true          | (OPTIONAL) Uses IntersectionObserver to ensure the images are only loaded to browser when the image comes near the browser viewport                                                              |
| `search-delay`         | Number  | 500           | (OPTIONAL) A delay in miliseconds after which the search event is fired.                                                                                                                         |
| `max-images-per-row`   | Number  | 5             | (OPTIONAL) Maximum number of images to be displayed in each row in image gallery. Must be a value from 1 to 6. Actual number of displayed images will vary based on screen-size                  |
| `is-searching`         | Boolean | false         | (OPTIONAL) Flag to know if we are getting images from server (init load or searching images). |
| `lang-search-placeholder` | String | `search...` | (OPTIONAL) Text used for search input's placeholder. |
| `lang-upload-button-label` | String | `Select Files` | (OPTIONAL) Upload button's label. |
| `lang-upload-filename` | String | `Filename` | (OPTIONAL) Text for filename's heading of uploaded file table |
| `lang-upload-status` | String | `Status` | (OPTIONAL) Text for status's heading of uploaded file table |
| `lang-upload-progress` | String | `Progress` | (OPTIONAL) Text for upload progress's heading of uploaded file table |
| `lang-upload-status-pending` | String | `Pending` | (OPTIONAL) Text for upload's pending status |
| `lang-upload-status-uploading` | String | `Uploaded %d KB` | (OPTIONAL) Text for upload's uploading status. `%d` is replaced by file size. |
| `lang-upload-status-completed` | String | `Completed` | (OPTIONAL) Text for upload's completed status |
| `lang-upload-status-failed` | String | `Failed` | (OPTIONAL) Text for upload's failed status |

## Events

Following events are generated when performing various interactions with the images.

| Event         | Parameter Type  | Parameter Value   |  Description                                                                                                                                                              |
|---------------|-----------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `search`      | String          | seach phrase      | This event is generated when users search in the search box. The search phrase is passed to the event handler, which can be used to filter the images array               |
| `select`      | Object          | image             | This event is generated when users click on an image in the Gallery. The image is passed to the event handler.                                                            |
| `delete`      | Object          | image             | This event is generated when users delete an image. The image is passed to the event handler.
| `uploaded`    | Object          | image             | This event is generated when users successfully upload an image. The image is passed to the event handler.  


## Example

```javascript
<template>


        <VueImageManager
            :images="images"
            allow-upload
            allow-delete
            enable-lazy-load
            upload-url="/api/media"
            :upload-request-headers="headers"
            @select="onSelect"
            @delete="onDelete"
            @search="onSearch"
            >
        </VueImageManager>


</template>

<script>

import VueImageBrowser from '@tranduyhung/vue-image-manager'

export default {
    components: {
        VueImageManager,
    },
    data() {
        return {
            images: [],
            headers: {
                "X-CSRF-Token": document.head.querySelector('meta[name="csrf-token"]').content
            },
            imageFields: {
                'id': 'File ID',
                'name': 'Image Name',
                'url': 'url',
                'size': 'File Size (KB)',
                'type': 'Image Type',
            }
        }
    },

    created() {
        this.getFromServer()
    },

    methods: {
        onDelete(image) {
            // make an ajax call to server to delete the image
            // TODO
            // on ajax success, remove the image from your list
            for(let i = 0; i < p.images.length; i++) {
                let image = p.images[i]
                if (image.id === image.id){
                        p.images.splice(i, 1)
                        break
                }
            }
        },

        onSelect(image) {
            console.log('on select', image)
        },

        onSearch(query) {
            this.getFromServer(query)
        },

        onSave(image) {
            this.images.unshift(image)
        },

        getFromServer(search_phrase) {
            // search the images on server based on the search phrase
        },

    }
}
</script>


```

## Dependency

[Spectre.css](https://picturepan2.github.io/spectre/) must be present for the styling.