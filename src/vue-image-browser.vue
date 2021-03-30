<template>
  <div>
    <div
      v-show="pane === 'gallery'"
      class="container"
      id="top-panel"
    >
      <div
        class="columns col-oneline mt-2 mb-2"
      >
        <div class="column col">
          <input
            class="form-input"
            type="text"
            v-model="query"
            @keyup="doDelayedSearch"
            placeholder="search..."
          />
          <div
            v-if="isSearching"
            class="mt-2 mb-2"
          >
            <div
              class="loading loading-lg"
            ></div>

          </div>
        </div>

        <div
          v-if="allowUpload"
          class="column col-auto"
        >
          <button
            class="btn btn-primary btn-action btn-lg"
            @click="pane = 'upload'"
          >
            <i class="icon icon-upload"></i>
          </button>
        </div>
      </div>
    </div>

    <div
      v-show="pane === 'gallery'"
      class="container"
    >
      <div
        class="columns"
      >
        <div
          v-show="!isSearching"
          v-for="photo in images"
          :key="photo.id"
          :class="imagesPerRow"
          @click="select(photo)"
        >
          <div
            class="card mb-2"
          >
            <div class="card-image">
              <img
                v-bind:data-src="photo.url"
                :title="photo.name"
                class="mg-photo img-responsive"
              />
            </div>

            <div
              class="card-body"
            >
            </div>

            <div
              class="card-footer"
            >
              {{ photo.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="pane === 'photo'"
      class="container"
    >
      <div class="columns">
        <div
          class="column col4 col-mr-auto mt-2 mb-2"
        >
          <button
            class="btn btn-primary btn-action btn-lg"
            @click="pane = 'gallery'"
          >
            <i
              class="icon icon-arrow-left"
            >
            </i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="pane === 'photo'" class="w-full px-4 postcard-container">
      <div class="w-full postcard">
        <img
          :src="selectedPhoto.url"
          :title="selectedPhoto.name"
          class="mx-auto shadow-lg mg-photo"
        />
      </div>

      <div class="w-full text-sm px-2 py-2 bg-white">
        <table class="w-full mt-4 table-auto">
          <tr class="border-b" v-for="(pk, pv) in imageProperties">
            <td class="p-4 uppercase font-semibold text-gray-600">
              {{ pk.toUpperCase() }}
            </td>
            <td class="p-4 font-mono">{{ selectedPhoto[pv] }}</td>
          </tr>
        </table>

        <button
          @click="deleteSelected()"
          v-if="allowDelete"
          class="text-red-500 border m-4 mt-6 px-4 text-sm py-1 hover:border border-red-500 hover:text-white hover:bg-red-500 rounded cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>

    <div
      v-if="pane === 'upload'"
    >
      <div
        class="container"
      >
        <div class="columns">
          <div
            class="column col4 col-mr-auto mt-2 mb-2"
          >
            <button
              class="btn btn-primary btn-action btn-lg"
              @click="pane = 'gallery'"
            >
              <i
                class="icon icon-arrow-left"
              >
              </i>
            </button>
          </div>

          <div
            class="column col4 col-ml-auto mt-2 mb-2 text-right"
          >
            <form 
              enctype="multipart/form-data"
              method="post"
            >
              <label
                class="btn"
              >
                  <i
                    class="icon icon-upload"
                  >
                  </i> Upload From Local Computer

                  <input
                    id="files"
                    type="file"
                    name="files"
                    multiple
                    class="hidden"
                    @change="uploadFiles"
                  />
              </label>
            </form>
          </div>
        </div>
      </div>

      <div
        class="container"
        v-if="uploadableFiles.length > 0"
      >
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(f, index) in uploadableFiles"
              v-bind:key="index"
            >
              <td v-text="index + 1"></td>
              <td v-text="f.name"></td>
              <td>
                <span v-text="f.status"></span>
              </td>
              <td>
                <progress
                  :value="f.completion"
                  max="100"
                  class="progress"
                ></progress>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="container"
      v-if="message"
    >
      <div
        class="toast toast-primary"
        v-text="message"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vue-image-browser',

  props: {
    images: {
      type: Array,
      default: () => [],
    },

    imageProperties: {
      type: Object,
    },

    allowUpload: {
      type: Boolean,
      default: false,
    },

    saveUrl: {
      type: String,
      default: '/api/photos',
    },

    saveRequestHeaders: {
      type: Object,
      default: () => {},
    },

    searchDelay: {
      type: Number,
      default: 500,
    },

    allowDelete: {
      type: Boolean,
      default: false,
    },

    captionable: {
      type: Boolean,
      default: false,
    },

    enableLazyLoad: {
      type: Boolean,
      default: true,
    },

    maxImagesPerRow: {
      type: Number,
      default: 5,
    },

    postKey: {
      type: String,
      default: 'image',
    },

    isSearching: {
      type: Boolean,
      default: false,
    }
  },

  data: function () {
    return {
      query: '',
      pane: 'gallery',
      selectedPhoto: {},
      uploadableFiles: [],
    }
  },

  created() {
    this.$nextTick(function () {
      if (this.enableLazyLoad) {
        this.enableLazyLoading()
      }
    })
  },

  updated: function () {
    this.$nextTick(function () {
      if (this.enableLazyLoad) {
        this.enableLazyLoading()
      }
    })
  },

  computed: {
    imagesPerRow() {
      let col = parseInt(12 / this.maxImagesPerRow)

      return (
        'column col-' + col + ' col-xs-12'
      )
    }
  },

  methods: {
    select(photo) {
      this.selectedPhoto = photo

      this.pane = 'photo'

      this.captionable && (this.selectedPhoto['caption'] = this.getCaption())

      this.$emit('selected', this.selectedPhoto)
    },

    getCaption() {
      // remove file name extensions
      let caption = this.selectedPhoto.name.replace(/\.[^/.]+$/, '')

      // remove special characters with space
      caption = caption.replace(/[^\w\s]/gi, ' ')

      // uppercase first letter of each word
      caption = caption
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')

      return prompt('Enter an caption for this image', caption)
    },

    uploadFiles: function () {
      let files = document.getElementById('files').files,
        p = this

      for (let i = 0; i < files.length; i++) {
        let upf = {
          name: files[i].name,
          formdata: new FormData(),
          ajax: new XMLHttpRequest(),
          status: 'Not Started',
          completion: 0,
        }

        upf.formdata.append(this.postKey, files[i])
        upf.formdata.append('name', files[i].name)

        upf.ajax.upload.onprogress = function (e) {
          upf.status = 'Uploaded ' + Math.round(e.loaded / 1000) + ' KB...'
          upf.completion = Math.round((e.loaded / e.total) * 100)
        }
        upf.ajax.upload.onload = function (e) {
          upf.status = 'Complete'
          upf.completion = 100
        }
        upf.ajax.upload.onerror = function (e) {
          upf.status = 'Error uploading the file'
          upf.completion = 0
        }
        // ajax.upload.addEventListener('abort', abortHandler, false);

        upf.ajax.open('POST', p.saveUrl)

console.log(p)
console.log(upf)
        let header_keys = Object.keys(p.saveRequestHeaders)
        for (let i = 0; i < header_keys.length; i++) {
          let header = header_keys[i]
          let val = p.saveRequestHeaders[header]
          upf.ajax.setRequestHeader(header, val)
        }

        upf.ajax.onreadystatechange = function () {
          if (upf.ajax.readyState === 4 && upf.ajax.status === 200) {
            let response = upf.ajax.responseText
            if (response) {
              try {
                let media = JSON.parse(response)
                p.$emit('saved', media)
              } catch (e) {
                alert(e)
              }
            }
          }
          if (upf.ajax.readyState === 4 && upf.ajax.status != 200) {
            upf.status =
              'Error uploading the file (Status = ' + upf.ajax.status + ')'
            upf.completion = 0
          }
        }
        upf.ajax.send(upf.formdata)
        this.uploadableFiles.push(upf)
      }
    },

    deleteSelected() {
      this.$emit('deleted', this.selectedPhoto)
      this.pane = 'gallery'
    },

    doDelayedSearch() {
      let p = this

      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      this.timer = setTimeout(() => {
        p.$emit('searched', p.query)
      }, this.searchDelay)
    },

    // This is an experimental function that enables
    // lazy-loading.
    enableLazyLoading() {
      let images = document.querySelectorAll('.mg-photo')

      const config = {
        root: null,
        rootMargin: '0px 0px 50px 0px',
      }

      // check if intersection observer is supported via browser
      if (!('IntersectionObserver' in window)) {
        // if not, just load all immediately
        Array.from(images).forEach(function (image) {
          console.log('IntersectionObserver unsupported loading')
          if (!image.src) image.src = image.dataset.src
        })
      } else {
        let observer = new IntersectionObserver(function (entries) {
          entries.forEach((image) => {
            // Are we in viewport?
            if (image.isIntersecting) {
              // console.log('Loading: ' + image.target.dataset.src)
              // console.log(image.target.src)
              image.target.src = image.target.dataset.src
              observer.unobserve(image.target)
            }
          })
        }, config)

        images.forEach((image) => {
          if (!image.src) {
            observer.observe(image)
          }
        })
      }
    },
  },
}
</script>

<style>
@media only screen and (min-width: 640px) {
  .thumbnail {
    height: 300px;
    overflow: hidden;
  }
}
@media only screen and (min-width: 768px) {
  .thumbnail {
    height: 250px;
    overflow: hidden;
  }
}
@media only screen and (min-width: 1024px) {
  .thumbnail {
    height: 200px;
    overflow: hidden;
  }
}
@media only screen and (min-width: 1280px) {
  .thumbnail {
    height: 120px;
    overflow: hidden;
  }
}
.card:hover {
  cursor: pointer;
}
</style>
