<template>
  <div
    class="image-manager"
  >
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
            :placeholder="langSearchPlaceholder"
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
            type="button"
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
          v-for="image in images"
          :key="image.id"
          :class="imagesPerRow"
          @click="select(image)"
        >
            <div
              class="card"
            >
              <div class="card-image">
                <img
                  v-bind:data-src="image.url"
                  :title="image.name"
                  class="mg-image img-responsive"
                />
              </div>

              <div
                class="card-body"
              >
              </div>

              <div
                class="card-footer"
              >
                {{ image.name }}
              </div>
            </div>
        </div>
      </div>
    </div>

    <div
      v-if="pane === 'image'"
      class="container"
    >
      <div class="columns">
        <div
          class="column col4 col-mr-auto mt-2 mb-2"
        >
          <button
            type="button"
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

    <div
      v-if="pane === 'image'"
      class="container">
      <figure
        class="figure"
      >
        <img
          :src="selectedImage.url"
          :title="selectedImage.name"
          class="img-responsive p-centered"
        />

        <figcaption
          class="figure-caption text-center"
          v-text="selectedImage.name"
        >
        </figcaption>
      </figure>

      <div
        class="mt-2 mb-2"
      >
        <button
          type="button"
          @click="deleteSelected"
          v-if="allowDelete"
          class="btn btn-error"
          v-bind:class="{ loading: isDeleting }"
          :disabled="isDeleting"
        >
          {{ langDeleteButtonLabel }}
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
              type="button"
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
                  </i> {{ langUploadButtonLabel }}

                  <input
                    type="file"
                    multiple
                    class="d-none"
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
        <table
          class="table table-striped table-hover"
        >
          <thead>
            <tr>
              <th>#</th>
              <th v-text="langUploadFilename"></th>
              <th v-text="langUploadStatus"></th>
              <th v-text="langUploadProgress"></th>
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
  </div>
</template>

<script>
export default {
  name: 'vue-image-manager',

  props: {
    images: {
      type: Array,
      default: () => [],
    },

    allowUpload: {
      type: Boolean,
      default: false,
    },

    uploadUrl: {
      type: String,
      default: '/api/images',
    },

    uploadRequestHeaders: {
      type: Object,
      default: () => { return {} },
    },

    uploadFormData: {
      type: Object,
      default: () => { return {} },
    },

    searchDelay: {
      type: Number,
      default: 500,
    },

    allowDelete: {
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

    isSearching: {
      type: Boolean,
      default: false,
    },

    isDeleting: {
      type: Boolean,
      default: false,
    },

    langSearchPlaceholder: {
      type: String,
      default: 'search...',
    },

    langUploadButtonLabel: {
      type: String,
      default: 'Select Files',
    },

    langDeleteButtonLabel: {
      type: String,
      default: 'Delete',
    },

    langUploadFilename: {
      type: String,
      default: 'Filename',
    },

    langUploadStatus: {
      type: String,
      default: 'Status',
    },

    langUploadProgress: {
      type: String,
      default: 'Progress',
    },

    langUploadStatusPending: {
      type: String,
      default: 'Pending',
    },

    langUploadStatusUploading: {
      type: String,
      default: 'Uploaded %d KB',
    },

    langUploadStatusCompleted: {
      type: String,
      default: 'Completed',
    },

    langUploadStatusFailed: {
      type: String,
      default: 'Failed',
    },
  },

  data: function () {
    return {
      query: '',
      pane: 'gallery',
      selectedImage: {},
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
        'column col-' + col + ' col-xs-12 mb-2'
      )
    }
  },

  methods: {
    select(image) {
      this.selectedImage = image

      this.pane = 'image'

      this.$emit('select', this.selectedImage)
    },

    uploadFiles: function (event) {
      let input = event.target
      let files = input.files
      let p = this

      for (let i = 0; i < files.length; i++) {
        let upf = {
          name: files[i].name,
          formdata: new FormData(),
          ajax: new XMLHttpRequest(),
          status: p.langUploadStatusPending,
          completion: 0,
        }

        upf.formdata.append('file', files[i])

        let formKeys = Object.keys(p.uploadFormData)

        for (let i = 0; i < formKeys.length; i++) {
          let key = formKeys[i]
          let val = p.uploadFormData[key]
          upf.formdata.append(key, val)
        }

        upf.ajax.upload.onprogress = function (e) {
          upf.status = p.langUploadStatusUploading.replace('%d', Math.round(e.loaded / 1000))
          upf.completion = Math.round((e.loaded / e.total) * 100)
        }

        upf.ajax.upload.onload = function (e) {
          upf.status = p.langUploadStatusCompleted
          upf.completion = 100
        }

        upf.ajax.upload.onerror = function (e) {
          upf.status = p.langUploadStatusFailed
          upf.completion = 0
        }

        upf.ajax.open('POST', p.uploadUrl)

        let headerKeys = Object.keys(p.uploadRequestHeaders)

        for (let i = 0; i < headerKeys.length; i++) {
          let header = headerKeys[i]
          let val = p.uploadRequestHeaders[header]
          upf.ajax.setRequestHeader(header, val)
        }

        upf.ajax.onreadystatechange = function () {
          if (upf.ajax.readyState === 4) {
            if (upf.ajax.status != 200) {
              upf.status = langUploadStatusFailed
              upf.completion = 0
            }

            p.$emit('uploaded', upf.ajax)
          }
        }

        upf.ajax.send(upf.formdata)
          this.uploadableFiles.push(upf)
      }
    },

    deleteSelected() {
      this.$emit('delete', this.selectedImage)
    },

    doDelayedSearch() {
      let p = this

      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      this.timer = setTimeout(() => {
        p.$emit('search', p.query)
      }, this.searchDelay)
    },

    // This is an experimental function that enables
    // lazy-loading.
    enableLazyLoading() {
      let images = document.querySelectorAll('.mg-image')

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
.image-manager .card {
  height: 100%;
}
.image-manager .card:hover {
  cursor: pointer;
}
.image-manager .card-footer {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
