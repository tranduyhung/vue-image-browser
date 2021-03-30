var imageManager = {
  template: '#imageManagerTemplate',
  data() {
    return {
      allPhotos: [
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
      photos: [],
      photoFields: {
        'id': 'Image ID', 'name': 'File Name', 'url': 'Image Location'
      },
      isSearching: false,
    }
  },
  methods: {
    onDelete(image) {
      console.log('onDelete', image)
      // make an ajax call to server to delete the image
      // TODO
      // on ajax success, remove the image from your list
      for(let i = 0; i < p.photos.length; i++) {
        let photo = p.photos[i]
        if (photo.id === image.id){
          p.photos.splice(i, 1)
          break
        }
      }
    },

    onSelect(image) {
      console.log('onSelect', image)
    },

    onChoose(image) {
      console.log('onChoose', image)
    },

    onSearch(query) {
      console.log('onSearch', query)

      this.isSearching = true

      let _this = this

      // Simulate searching
      setTimeout(function() {
        if (query) {
          // Create a different list of images.
          _this.photos.pop()
          _this.photos.pop()
          _this.photos.pop()
        } else {
          // Clear search result, all photos appear.
          _this.photos = _this.allPhotos
        }

        _this.isSearching = false
      }, 2000)

    },

    onSave(image) {
      console.log('onSave', image)
    },
  },
  mounted() {
    for (i = 0; i <this.allPhotos.length; i++) {
      this.photos.push(this.allPhotos[i])
    }
  }
}
  
var app = new Vue({
  el: '#app',
  components: {
    'image-manager': imageManager
  },
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    
  }
})