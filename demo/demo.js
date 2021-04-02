var imageManager = {
  template: '#imageManagerTemplate',
  data() {
    return {
      allImages: [
        {'id': 1, 'name': 'andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg', 'url': 'andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg'},
        {'id': 2, 'name': 'david-marcu-78A265wPiO4-unsplash.jpg', 'url': 'david-marcu-78A265wPiO4-unsplash.jpg'},
        {'id': 3, 'name': 'jay-mantri-TFyi0QOx08c-unsplash.jpg', 'url': 'jay-mantri-TFyi0QOx08c-unsplash.jpg'},
        {'id': 4, 'name': 'luca-bravo-VowIFDxogG4-unsplash.jpg', 'url': 'luca-bravo-VowIFDxogG4-unsplash.jpg'},
        {'id': 5, 'name': 'lukasz-szmigiel-jFCViYFYcus-unsplash.jpg', 'url': 'lukasz-szmigiel-jFCViYFYcus-unsplash.jpg'},
        {'id': 6, 'name': 'sebastian-unrau-v4e3JI7DDHI-unsplash.jpg', 'url': 'sebastian-unrau-v4e3JI7DDHI-unsplash.jpg'},
        {'id': 7, 'name': 'silvestri-matteo-6-C0VRsagUw-unsplash.jpg', 'url': 'silvestri-matteo-6-C0VRsagUw-unsplash.jpg'},
        {'id': 8, 'name': 'tim-swaan-eOpewngf68w-unsplash.jpg', 'url': 'tim-swaan-eOpewngf68w-unsplash.jpg'},
        {'id': 9, 'name': 'v2osk-1Z2niiBPg5A-unsplash.jpg', 'url': 'v2osk-1Z2niiBPg5A-unsplash.jpg'},
      ],
      images: [],
      imageFields: {
        'id': 'Image ID', 'name': 'File Name', 'url': 'Image Location'
      },
      isSearching: false,
      isDeleting: false,
    }
  },
  methods: {
    onDelete(image) {
      let _this = this

      _this.isDeleting = true

      // Simulate deleting image on server
      setTimeout(function() {
        _this.isDeleting = false
      }, 5000)
    },

    onSelect(image) {
      console.log('onSelect', image)
    },

    onUploaded(image) {
      console.log('onUploaded', image)
    },

    onSearch(query) {
      console.log('onSearch', query)

      this.isSearching = true

      let _this = this

      // Simulate searching
      setTimeout(function() {
        if (query) {
          // Create a different list of images.
          _this.images.pop()
          _this.images.pop()
          _this.images.pop()
        } else {
          // Clear search result, all images appear.
          _this.images = _this.allImages
        }

        _this.isSearching = false
      }, 2000)

    },
  },
  mounted() {
    for (i = 0; i <this.allImages.length; i++) {
      this.images.push(this.allImages[i])
    }
  }
}
  
var app = new Vue({
  el: '#app',
  components: {
    'image-manager': imageManager
  },
})