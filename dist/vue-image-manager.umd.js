(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueImageManager = {}));
}(this, (function (exports) { 'use strict';

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {
    name: 'vue-image-manager',

    props: {
      images: {
        type: Array,
        default: function () { return []; },
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
        default: function () {},
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

    created: function created() {
      this.$nextTick(function () {
        if (this.enableLazyLoad) {
          this.enableLazyLoading();
        }
      });
    },

    updated: function () {
      this.$nextTick(function () {
        if (this.enableLazyLoad) {
          this.enableLazyLoading();
        }
      });
    },

    computed: {
      imagesPerRow: function imagesPerRow() {
        var col = parseInt(12 / this.maxImagesPerRow);

        return (
          'column col-' + col + ' col-xs-12'
        )
      }
    },

    methods: {
      select: function select(photo) {
        this.selectedPhoto = photo;

        this.pane = 'photo';

        this.captionable && (this.selectedPhoto['caption'] = this.getCaption());

        this.$emit('selected', this.selectedPhoto);
      },

      getCaption: function getCaption() {
        // remove file name extensions
        var caption = this.selectedPhoto.name.replace(/\.[^/.]+$/, '');

        // remove special characters with space
        caption = caption.replace(/[^\w\s]/gi, ' ');

        // uppercase first letter of each word
        caption = caption
          .toLowerCase()
          .split(' ')
          .map(function (s) { return s.charAt(0).toUpperCase() + s.substring(1); })
          .join(' ');

        return prompt('Enter an caption for this image', caption)
      },

      uploadFiles: function () {
        var this$1 = this;

        var files = document.getElementById('files').files,
          p = this;

        var loop = function ( i ) {
          var upf = {
            name: files[i].name,
            formdata: new FormData(),
            ajax: new XMLHttpRequest(),
            status: 'Not Started',
            completion: 0,
          };

          upf.formdata.append(this$1.postKey, files[i]);
          upf.formdata.append('name', files[i].name);

          upf.ajax.upload.onprogress = function (e) {
            upf.status = 'Uploaded ' + Math.round(e.loaded / 1000) + ' KB...';
            upf.completion = Math.round((e.loaded / e.total) * 100);
          };
          upf.ajax.upload.onload = function (e) {
            upf.status = 'Complete';
            upf.completion = 100;
          };
          upf.ajax.upload.onerror = function (e) {
            upf.status = 'Error uploading the file';
            upf.completion = 0;
          };
          // ajax.upload.addEventListener('abort', abortHandler, false);

          upf.ajax.open('POST', p.saveUrl);

  console.log(p);
  console.log(upf);
          var header_keys = Object.keys(p.saveRequestHeaders);
          for (var i$1 = 0; i$1 < header_keys.length; i$1++) {
            var header = header_keys[i$1];
            var val = p.saveRequestHeaders[header];
            upf.ajax.setRequestHeader(header, val);
          }

          upf.ajax.onreadystatechange = function () {
            if (upf.ajax.readyState === 4 && upf.ajax.status === 200) {
              var response = upf.ajax.responseText;
              if (response) {
                try {
                  var media = JSON.parse(response);
                  p.$emit('saved', media);
                } catch (e) {
                  alert(e);
                }
              }
            }
            if (upf.ajax.readyState === 4 && upf.ajax.status != 200) {
              upf.status =
                'Error uploading the file (Status = ' + upf.ajax.status + ')';
              upf.completion = 0;
            }
          };
          upf.ajax.send(upf.formdata);
          this$1.uploadableFiles.push(upf);
        };

        for (var i = 0; i < files.length; i++) loop( i );
      },

      deleteSelected: function deleteSelected() {
        this.$emit('deleted', this.selectedPhoto);
        this.pane = 'gallery';
      },

      doDelayedSearch: function doDelayedSearch() {
        var p = this;

        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }

        this.timer = setTimeout(function () {
          p.$emit('searched', p.query);
        }, this.searchDelay);
      },

      // This is an experimental function that enables
      // lazy-loading.
      enableLazyLoading: function enableLazyLoading() {
        var images = document.querySelectorAll('.mg-photo');

        var config = {
          root: null,
          rootMargin: '0px 0px 50px 0px',
        };

        // check if intersection observer is supported via browser
        if (!('IntersectionObserver' in window)) {
          // if not, just load all immediately
          Array.from(images).forEach(function (image) {
            console.log('IntersectionObserver unsupported loading');
            if (!image.src) { image.src = image.dataset.src; }
          });
        } else {
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (image) {
              // Are we in viewport?
              if (image.isIntersecting) {
                // console.log('Loading: ' + image.target.dataset.src)
                // console.log(image.target.src)
                image.target.src = image.target.dataset.src;
                observer.unobserve(image.target);
              }
            });
          }, config);

          images.forEach(function (image) {
            if (!image.src) {
              observer.observe(image);
            }
          });
        }
      },
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.pane === "gallery",
              expression: "pane === 'gallery'"
            }
          ],
          staticClass: "container",
          attrs: { id: "top-panel" }
        },
        [
          _c("div", { staticClass: "columns col-oneline mt-2 mb-2" }, [
            _c("div", { staticClass: "column col" }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.query,
                    expression: "query"
                  }
                ],
                staticClass: "form-input",
                attrs: { type: "text", placeholder: "search..." },
                domProps: { value: _vm.query },
                on: {
                  keyup: _vm.doDelayedSearch,
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.query = $event.target.value;
                  }
                }
              }),
              _vm._v(" "),
              _vm.isSearching
                ? _c("div", { staticClass: "mt-2 mb-2" }, [
                    _c("div", { staticClass: "loading loading-lg" })
                  ])
                : _vm._e()
            ]),
            _vm._v(" "),
            _vm.allowUpload
              ? _c("div", { staticClass: "column col-auto" }, [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary btn-action btn-lg",
                      on: {
                        click: function($event) {
                          _vm.pane = "upload";
                        }
                      }
                    },
                    [_c("i", { staticClass: "icon icon-upload" })]
                  )
                ])
              : _vm._e()
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.pane === "gallery",
              expression: "pane === 'gallery'"
            }
          ],
          staticClass: "container"
        },
        [
          _c(
            "div",
            { staticClass: "columns" },
            _vm._l(_vm.images, function(photo) {
              return _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !_vm.isSearching,
                      expression: "!isSearching"
                    }
                  ],
                  key: photo.id,
                  class: _vm.imagesPerRow,
                  on: {
                    click: function($event) {
                      return _vm.select(photo)
                    }
                  }
                },
                [
                  _c("div", { staticClass: "card mb-2" }, [
                    _c("div", { staticClass: "card-image" }, [
                      _c("img", {
                        staticClass: "mg-photo img-responsive",
                        attrs: { "data-src": photo.url, title: photo.name }
                      })
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "card-body" }),
                    _vm._v(" "),
                    _c("div", { staticClass: "card-footer" }, [
                      _vm._v(
                        "\n            " + _vm._s(photo.name) + "\n          "
                      )
                    ])
                  ])
                ]
              )
            }),
            0
          )
        ]
      ),
      _vm._v(" "),
      _vm.pane === "photo"
        ? _c("div", { staticClass: "container" }, [
            _c("div", { staticClass: "columns" }, [
              _c("div", { staticClass: "column col4 col-mr-auto mt-2 mb-2" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary btn-action btn-lg",
                    on: {
                      click: function($event) {
                        _vm.pane = "gallery";
                      }
                    }
                  },
                  [_c("i", { staticClass: "icon icon-arrow-left" })]
                )
              ])
            ])
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.pane === "photo"
        ? _c("div", [
            _c("figure", { staticClass: "figure" }, [
              _c("img", {
                staticClass: "img-responsive p-centered",
                attrs: {
                  src: _vm.selectedPhoto.url,
                  title: _vm.selectedPhoto.name
                }
              }),
              _vm._v(" "),
              _c("figcaption", {
                staticClass: "figure-caption text-center",
                domProps: { textContent: _vm._s(_vm.selectedPhoto.name) }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "mt-2 mb-2" }, [
              _vm.allowDelete
                ? _c(
                    "button",
                    {
                      staticClass: "btn btn-error",
                      on: {
                        click: function($event) {
                          return _vm.deleteSelected()
                        }
                      }
                    },
                    [_vm._v("\n        Delete\n      ")]
                  )
                : _vm._e()
            ])
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.pane === "upload"
        ? _c("div", [
            _c("div", { staticClass: "container" }, [
              _c("div", { staticClass: "columns" }, [
                _c("div", { staticClass: "column col4 col-mr-auto mt-2 mb-2" }, [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary btn-action btn-lg",
                      on: {
                        click: function($event) {
                          _vm.pane = "gallery";
                        }
                      }
                    },
                    [_c("i", { staticClass: "icon icon-arrow-left" })]
                  )
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "column col4 col-ml-auto mt-2 mb-2 text-right" },
                  [
                    _c(
                      "form",
                      {
                        attrs: { enctype: "multipart/form-data", method: "post" }
                      },
                      [
                        _c("label", { staticClass: "btn" }, [
                          _c("i", { staticClass: "icon icon-upload" }),
                          _vm._v(
                            " Upload From Local Computer\n\n                "
                          ),
                          _c("input", {
                            staticClass: "hidden",
                            attrs: {
                              id: "files",
                              type: "file",
                              name: "files",
                              multiple: ""
                            },
                            on: { change: _vm.uploadFiles }
                          })
                        ])
                      ]
                    )
                  ]
                )
              ])
            ]),
            _vm._v(" "),
            _vm.uploadableFiles.length > 0
              ? _c("div", { staticClass: "container" }, [
                  _c(
                    "table",
                    { staticClass: "table table-striped table-hover" },
                    [
                      _vm._m(0),
                      _vm._v(" "),
                      _c(
                        "tbody",
                        _vm._l(_vm.uploadableFiles, function(f, index) {
                          return _c("tr", { key: index }, [
                            _c("td", {
                              domProps: { textContent: _vm._s(index + 1) }
                            }),
                            _vm._v(" "),
                            _c("td", {
                              domProps: { textContent: _vm._s(f.name) }
                            }),
                            _vm._v(" "),
                            _c("td", [
                              _c("span", {
                                domProps: { textContent: _vm._s(f.status) }
                              })
                            ]),
                            _vm._v(" "),
                            _c("td", [
                              _c("progress", {
                                staticClass: "progress",
                                attrs: { max: "100" },
                                domProps: { value: f.completion }
                              })
                            ])
                          ])
                        }),
                        0
                      )
                    ]
                  )
                ])
              : _vm._e()
          ])
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__ = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("thead", [
        _c("tr", [
          _c("th", [_vm._v("#")]),
          _vm._v(" "),
          _c("th", [_vm._v("File Name")]),
          _vm._v(" "),
          _c("th", [_vm._v("Status")]),
          _vm._v(" "),
          _c("th", [_vm._v("Progress")])
        ])
      ])
    }
  ];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-68918e61_0", { source: "\n@media only screen and (min-width: 640px) {\n.thumbnail {\n    height: 300px;\n    overflow: hidden;\n}\n}\n@media only screen and (min-width: 768px) {\n.thumbnail {\n    height: 250px;\n    overflow: hidden;\n}\n}\n@media only screen and (min-width: 1024px) {\n.thumbnail {\n    height: 200px;\n    overflow: hidden;\n}\n}\n@media only screen and (min-width: 1280px) {\n.thumbnail {\n    height: 120px;\n    overflow: hidden;\n}\n}\n.card:hover {\n  cursor: pointer;\n}\n", map: {"version":3,"sources":["/var/www/html/vue-image-manager/src/vue-image-manager.vue"],"names":[],"mappings":";AAwdA;AACA;IACA,aAAA;IACA,gBAAA;AACA;AACA;AACA;AACA;IACA,aAAA;IACA,gBAAA;AACA;AACA;AACA;AACA;IACA,aAAA;IACA,gBAAA;AACA;AACA;AACA;AACA;IACA,aAAA;IACA,gBAAA;AACA;AACA;AACA;EACA,eAAA;AACA","file":"vue-image-manager.vue","sourcesContent":["<template>\n  <div>\n    <div\n      v-show=\"pane === 'gallery'\"\n      class=\"container\"\n      id=\"top-panel\"\n    >\n      <div\n        class=\"columns col-oneline mt-2 mb-2\"\n      >\n        <div class=\"column col\">\n          <input\n            class=\"form-input\"\n            type=\"text\"\n            v-model=\"query\"\n            @keyup=\"doDelayedSearch\"\n            placeholder=\"search...\"\n          />\n          <div\n            v-if=\"isSearching\"\n            class=\"mt-2 mb-2\"\n          >\n            <div\n              class=\"loading loading-lg\"\n            ></div>\n\n          </div>\n        </div>\n\n        <div\n          v-if=\"allowUpload\"\n          class=\"column col-auto\"\n        >\n          <button\n            class=\"btn btn-primary btn-action btn-lg\"\n            @click=\"pane = 'upload'\"\n          >\n            <i class=\"icon icon-upload\"></i>\n          </button>\n        </div>\n      </div>\n    </div>\n\n    <div\n      v-show=\"pane === 'gallery'\"\n      class=\"container\"\n    >\n      <div\n        class=\"columns\"\n      >\n        <div\n          v-show=\"!isSearching\"\n          v-for=\"photo in images\"\n          :key=\"photo.id\"\n          :class=\"imagesPerRow\"\n          @click=\"select(photo)\"\n        >\n          <div\n            class=\"card mb-2\"\n          >\n            <div class=\"card-image\">\n              <img\n                v-bind:data-src=\"photo.url\"\n                :title=\"photo.name\"\n                class=\"mg-photo img-responsive\"\n              />\n            </div>\n\n            <div\n              class=\"card-body\"\n            >\n            </div>\n\n            <div\n              class=\"card-footer\"\n            >\n              {{ photo.name }}\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div\n      v-if=\"pane === 'photo'\"\n      class=\"container\"\n    >\n      <div class=\"columns\">\n        <div\n          class=\"column col4 col-mr-auto mt-2 mb-2\"\n        >\n          <button\n            class=\"btn btn-primary btn-action btn-lg\"\n            @click=\"pane = 'gallery'\"\n          >\n            <i\n              class=\"icon icon-arrow-left\"\n            >\n            </i>\n          </button>\n        </div>\n      </div>\n    </div>\n\n    <div v-if=\"pane === 'photo'\">\n      <figure\n        class=\"figure\"\n      >\n        <img\n          :src=\"selectedPhoto.url\"\n          :title=\"selectedPhoto.name\"\n          class=\"img-responsive p-centered\"\n        />\n\n        <figcaption\n          class=\"figure-caption text-center\"\n          v-text=\"selectedPhoto.name\"\n        >\n        </figcaption>\n      </figure>\n\n      <div\n        class=\"mt-2 mb-2\"\n      >\n        <button\n          @click=\"deleteSelected()\"\n          v-if=\"allowDelete\"\n          class=\"btn btn-error\"\n        >\n          Delete\n        </button>\n      </div>\n    </div>\n\n    <div\n      v-if=\"pane === 'upload'\"\n    >\n      <div\n        class=\"container\"\n      >\n        <div class=\"columns\">\n          <div\n            class=\"column col4 col-mr-auto mt-2 mb-2\"\n          >\n            <button\n              class=\"btn btn-primary btn-action btn-lg\"\n              @click=\"pane = 'gallery'\"\n            >\n              <i\n                class=\"icon icon-arrow-left\"\n              >\n              </i>\n            </button>\n          </div>\n\n          <div\n            class=\"column col4 col-ml-auto mt-2 mb-2 text-right\"\n          >\n            <form \n              enctype=\"multipart/form-data\"\n              method=\"post\"\n            >\n              <label\n                class=\"btn\"\n              >\n                  <i\n                    class=\"icon icon-upload\"\n                  >\n                  </i> Upload From Local Computer\n\n                  <input\n                    id=\"files\"\n                    type=\"file\"\n                    name=\"files\"\n                    multiple\n                    class=\"hidden\"\n                    @change=\"uploadFiles\"\n                  />\n              </label>\n            </form>\n          </div>\n        </div>\n      </div>\n\n      <div\n        class=\"container\"\n        v-if=\"uploadableFiles.length > 0\"\n      >\n        <table\n          class=\"table table-striped table-hover\"\n        >\n          <thead>\n            <tr>\n              <th>#</th>\n              <th>File Name</th>\n              <th>Status</th>\n              <th>Progress</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr\n              v-for=\"(f, index) in uploadableFiles\"\n              v-bind:key=\"index\"\n            >\n              <td v-text=\"index + 1\"></td>\n              <td v-text=\"f.name\"></td>\n              <td>\n                <span v-text=\"f.status\"></span>\n              </td>\n              <td>\n                <progress\n                  :value=\"f.completion\"\n                  max=\"100\"\n                  class=\"progress\"\n                ></progress>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'vue-image-manager',\n\n  props: {\n    images: {\n      type: Array,\n      default: () => [],\n    },\n\n    allowUpload: {\n      type: Boolean,\n      default: false,\n    },\n\n    saveUrl: {\n      type: String,\n      default: '/api/photos',\n    },\n\n    saveRequestHeaders: {\n      type: Object,\n      default: () => {},\n    },\n\n    searchDelay: {\n      type: Number,\n      default: 500,\n    },\n\n    allowDelete: {\n      type: Boolean,\n      default: false,\n    },\n\n    captionable: {\n      type: Boolean,\n      default: false,\n    },\n\n    enableLazyLoad: {\n      type: Boolean,\n      default: true,\n    },\n\n    maxImagesPerRow: {\n      type: Number,\n      default: 5,\n    },\n\n    postKey: {\n      type: String,\n      default: 'image',\n    },\n\n    isSearching: {\n      type: Boolean,\n      default: false,\n    }\n  },\n\n  data: function () {\n    return {\n      query: '',\n      pane: 'gallery',\n      selectedPhoto: {},\n      uploadableFiles: [],\n    }\n  },\n\n  created() {\n    this.$nextTick(function () {\n      if (this.enableLazyLoad) {\n        this.enableLazyLoading()\n      }\n    })\n  },\n\n  updated: function () {\n    this.$nextTick(function () {\n      if (this.enableLazyLoad) {\n        this.enableLazyLoading()\n      }\n    })\n  },\n\n  computed: {\n    imagesPerRow() {\n      let col = parseInt(12 / this.maxImagesPerRow)\n\n      return (\n        'column col-' + col + ' col-xs-12'\n      )\n    }\n  },\n\n  methods: {\n    select(photo) {\n      this.selectedPhoto = photo\n\n      this.pane = 'photo'\n\n      this.captionable && (this.selectedPhoto['caption'] = this.getCaption())\n\n      this.$emit('selected', this.selectedPhoto)\n    },\n\n    getCaption() {\n      // remove file name extensions\n      let caption = this.selectedPhoto.name.replace(/\\.[^/.]+$/, '')\n\n      // remove special characters with space\n      caption = caption.replace(/[^\\w\\s]/gi, ' ')\n\n      // uppercase first letter of each word\n      caption = caption\n        .toLowerCase()\n        .split(' ')\n        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))\n        .join(' ')\n\n      return prompt('Enter an caption for this image', caption)\n    },\n\n    uploadFiles: function () {\n      let files = document.getElementById('files').files,\n        p = this\n\n      for (let i = 0; i < files.length; i++) {\n        let upf = {\n          name: files[i].name,\n          formdata: new FormData(),\n          ajax: new XMLHttpRequest(),\n          status: 'Not Started',\n          completion: 0,\n        }\n\n        upf.formdata.append(this.postKey, files[i])\n        upf.formdata.append('name', files[i].name)\n\n        upf.ajax.upload.onprogress = function (e) {\n          upf.status = 'Uploaded ' + Math.round(e.loaded / 1000) + ' KB...'\n          upf.completion = Math.round((e.loaded / e.total) * 100)\n        }\n        upf.ajax.upload.onload = function (e) {\n          upf.status = 'Complete'\n          upf.completion = 100\n        }\n        upf.ajax.upload.onerror = function (e) {\n          upf.status = 'Error uploading the file'\n          upf.completion = 0\n        }\n        // ajax.upload.addEventListener('abort', abortHandler, false);\n\n        upf.ajax.open('POST', p.saveUrl)\n\nconsole.log(p)\nconsole.log(upf)\n        let header_keys = Object.keys(p.saveRequestHeaders)\n        for (let i = 0; i < header_keys.length; i++) {\n          let header = header_keys[i]\n          let val = p.saveRequestHeaders[header]\n          upf.ajax.setRequestHeader(header, val)\n        }\n\n        upf.ajax.onreadystatechange = function () {\n          if (upf.ajax.readyState === 4 && upf.ajax.status === 200) {\n            let response = upf.ajax.responseText\n            if (response) {\n              try {\n                let media = JSON.parse(response)\n                p.$emit('saved', media)\n              } catch (e) {\n                alert(e)\n              }\n            }\n          }\n          if (upf.ajax.readyState === 4 && upf.ajax.status != 200) {\n            upf.status =\n              'Error uploading the file (Status = ' + upf.ajax.status + ')'\n            upf.completion = 0\n          }\n        }\n        upf.ajax.send(upf.formdata)\n        this.uploadableFiles.push(upf)\n      }\n    },\n\n    deleteSelected() {\n      this.$emit('deleted', this.selectedPhoto)\n      this.pane = 'gallery'\n    },\n\n    doDelayedSearch() {\n      let p = this\n\n      if (this.timer) {\n        clearTimeout(this.timer)\n        this.timer = null\n      }\n\n      this.timer = setTimeout(() => {\n        p.$emit('searched', p.query)\n      }, this.searchDelay)\n    },\n\n    // This is an experimental function that enables\n    // lazy-loading.\n    enableLazyLoading() {\n      let images = document.querySelectorAll('.mg-photo')\n\n      const config = {\n        root: null,\n        rootMargin: '0px 0px 50px 0px',\n      }\n\n      // check if intersection observer is supported via browser\n      if (!('IntersectionObserver' in window)) {\n        // if not, just load all immediately\n        Array.from(images).forEach(function (image) {\n          console.log('IntersectionObserver unsupported loading')\n          if (!image.src) image.src = image.dataset.src\n        })\n      } else {\n        let observer = new IntersectionObserver(function (entries) {\n          entries.forEach((image) => {\n            // Are we in viewport?\n            if (image.isIntersecting) {\n              // console.log('Loading: ' + image.target.dataset.src)\n              // console.log(image.target.src)\n              image.target.src = image.target.dataset.src\n              observer.unobserve(image.target)\n            }\n          })\n        }, config)\n\n        images.forEach((image) => {\n          if (!image.src) {\n            observer.observe(image)\n          }\n        })\n      }\n    },\n  },\n}\n</script>\n\n<style>\n@media only screen and (min-width: 640px) {\n  .thumbnail {\n    height: 300px;\n    overflow: hidden;\n  }\n}\n@media only screen and (min-width: 768px) {\n  .thumbnail {\n    height: 250px;\n    overflow: hidden;\n  }\n}\n@media only screen and (min-width: 1024px) {\n  .thumbnail {\n    height: 200px;\n    overflow: hidden;\n  }\n}\n@media only screen and (min-width: 1280px) {\n  .thumbnail {\n    height: 120px;\n    overflow: hidden;\n  }\n}\n.card:hover {\n  cursor: pointer;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  // Import vue component

  // Declare install function executed by Vue.use()
  function install(Vue) {
  	if (install.installed) { return; }
  	install.installed = true;
  	Vue.component('VueImageManager', __vue_component__);
  }

  // Create module definition for Vue.use()
  var plugin = {
  	install: install,
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
  	GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
  	GlobalVue = global.Vue;
  }
  if (GlobalVue) {
  	GlobalVue.use(plugin);
  }

  exports.default = __vue_component__;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
