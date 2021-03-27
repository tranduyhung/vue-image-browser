var imageManager = {
  template: '#imageManagerTemplate',
  data() {
    return {
    photos: [
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
    photoFields: {
      'id': 'Image ID', 'name': 'File Name', 'url': 'Image Location'
    }
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
  }
  })