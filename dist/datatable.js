'use strict';

var vue = require('vue');

var script$1 = {
    name:'pagination',
    emits: ['pagination-change-page'],
    props: {
        perPage:{},
        total:{},
        currentPage:{},
        from:{},
        processing: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 0
        },
    },
    computed: {
        lastPage () {
            return Math.ceil(
              this.total / this.perPage
            );
        },
        to () {
            return this.from +this.perPage * this.currentPage;
        },

        pageRange () {
            if (this.limit === -1) {
                return 0;
            }
            if (this.limit === 0) {
                return this.lastPage;
            }
            var current = this.currentPage;
            var last = this.lastPage;
            var delta = this.limit;
            var left = current - delta;
            var right = current + delta + 1;
            var range = [];
            var pages = [];
            var l;
            for (var i = 1; i <= last; i++) {
                if (i === 1 || i === last || (i >= left && i < right)) {
                    range.push(i);
                }
            }
            range.forEach(function (i) {
                if (l) {
                    if (i - l === 2) {
                        pages.push(l + 1);
                    } else if (i - l !== 1) {
                        pages.push('...');
                    }
                }
                pages.push(i);
                l = i;
            });
            return pages;
        }
    },
    methods: {
        previousPage () {
            this.selectPage((this.currentPage - 1));
        },
        nextPage () {
            this.selectPage((this.currentPage + 1));
        },
        selectPage (page) {
            if (page === '...') {
                return;
            }
            this.$emit('pagination-change-page', page);
        }
    },
};

const _hoisted_1$1 = { class: "col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-end" };
const _hoisted_2$1 = {
  class: "dataTables_paginate paging_simple_numbers",
  id: "kt_table_users_paginate"
};
const _hoisted_3$1 = { class: "pagination" };
const _hoisted_4$1 = /*#__PURE__*/vue.createElementVNode("i", { class: "previous" }, null, -1 /* HOISTED */);
const _hoisted_5$1 = [
  _hoisted_4$1
];
const _hoisted_6$1 = ["onClick"];
const _hoisted_7$1 = /*#__PURE__*/vue.createElementVNode("i", { class: "next" }, null, -1 /* HOISTED */);
const _hoisted_8$1 = [
  _hoisted_7$1
];

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
    vue.createElementVNode("div", _hoisted_2$1, [
      vue.createElementVNode("ul", _hoisted_3$1, [
        vue.createElementVNode("li", {
          class: vue.normalizeClass(["paginate_button page-item previous", {disabled: $props.currentPage === 1 || $props.processing}])
        }, [
          vue.createElementVNode("a", {
            onClick: _cache[0] || (_cache[0] = (...args) => ($options.previousPage && $options.previousPage(...args))),
            class: "page-link cursor-pointer"
          }, _hoisted_5$1)
        ], 2 /* CLASS */),
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.pageRange, (page, key) => {
          return (vue.openBlock(), vue.createElementBlock("li", {
            class: vue.normalizeClass(["paginate_button page-item cursor-pointer", { 'active': page === $props.currentPage, disabled:$props.processing }]),
            key: key
          }, [
            vue.createElementVNode("a", {
              "aria-controls": "kt_table_users",
              "data-dt-idx": "1",
              tabindex: "0",
              onClick: $event => ($options.selectPage(page)),
              class: "page-link"
            }, vue.toDisplayString(page), 9 /* TEXT, PROPS */, _hoisted_6$1)
          ], 2 /* CLASS */))
        }), 128 /* KEYED_FRAGMENT */)),
        vue.createElementVNode("li", {
          class: vue.normalizeClass(["paginate_button page-item next", {disabled: $props.currentPage === $options.lastPage || $props.processing}])
        }, [
          vue.createElementVNode("a", {
            onClick: _cache[1] || (_cache[1] = (...args) => ($options.nextPage && $options.nextPage(...args))),
            tabindex: "0",
            class: "page-link cursor-pointer"
          }, _hoisted_8$1)
        ], 2 /* CLASS */)
      ])
    ])
  ]))
}

script$1.render = render$1;
script$1.__file = "src/pagination.vue";

var script = {
  name: "Datatable",
  components: {pagination: script$1},
  props: {
    api: {required: true, dataType: String},
    columns: {required: true, dataType: Array},
    order: {required: true, dataType: Array},
    placeholder: {required: false, type: String, default: 'Type to search..'}
  },
  created() {

    Object.assign(this.datatable, {
      columns: this.columns,
      order: this.order.map((o) => ({column: o[0], dir: o[1]}))
    });


    this.getData();
  },
  data: () => ({
    processing: false,
    page: 1,
    debounce: null,

    datatable: {
      draw: 0,
      columns: [],
      order: [],
      search: {value: "", regex: "false"},
      filters:[],
      start: 0,
      length: 10,
      _: Date.now()
    },
    response: null
  }),
  computed: {
    rows() {
      return this.response ? this.response.data : [];
    },
    cols() {
      var columns = this.columns;

      return columns.map((col, index) => {
        let className = "text-start text-muted fw-bold fs-7 text-uppercase gs-0";
        let sortingOrder = this.datatable.order.find(e => e.column === index);
        if (sortingOrder)
          className += (sortingOrder.dir === 'desc') ? " sorting_desc" : ' sorting_asc';

        return {
          title: col.title,
          className: className,
          data: col.data,
          name: col.name,
          orderable: col.orderable,
          searchable: col.searchable,
        }
      });
    }
  },
  methods: {
    changePage(page) {
      this.page = page;
    },
    filter(id,value) {
      const existingFilter = this.datatable.filters.find(f => f.id === id);
      if (existingFilter) {
        existingFilter.value = value[0];
      } else {
        this.datatable.filters.push({id:id , value: value[0]});
      }
      if (this.page !== 1) {
        this.page = 1;
      } else {
        this.getData();
      }
    },
    debounceSearch() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        if (this.page !== 1) {
          this.page = 1;
        } else {
          this.getData();
        }
      }, 800);
    },
    orderBy(col, column) {
      if (column.orderable && !this.processing) { //desc, asc, remove
        // this.datatable.order = [{column: col, dir:"desc"}];
        let order = this.datatable.order.find(e => e.column === col);
        if (order) {
          if (order.dir === 'asc')
            this.datatable.order = this.datatable.order.filter(e => e.column !== col);

          if (order.dir === 'desc')
            order.dir = 'asc';
        } else {
          this.datatable.order = [{column: col, dir: "desc"}];
          // this.datatable.order.push({column: col, dir:"desc"})
        }
      }
    },
    getData() {
      this.processing = true;
      this.datatable.draw++;
      this.datatable._ = Date.now();
      axios.get(this.api, {params: this.datatable}).then((res) => {
        this.response = res.data;
        this.processing = false;
      }).catch((err) => {
        this.processing = false;
      });
    },
    actionsToggle(rowId) {
      var actions = document.getElementById(rowId);
      document.querySelectorAll('.actions-menu').forEach(function (menu) {
        if(menu.id != rowId)
          menu.classList.remove("d-block");
      });
      actions.classList.toggle("d-block");
    }
  },
  watch: {
    page(page) {
      this.datatable.start = this.datatable.length * page - this.datatable.length;
      this.getData();
    },
    ['datatable.length'](length) {
      if (this.page === 1)
        this.getData();

      this.page = 1;
    },
    ['datatable.order']: {
      deep: true,
      handler(datatable) {
        if (this.page === 1)
          this.getData();

        this.page = 1;
      }
    }
  }
};

const _hoisted_1 = { class: "card" };
const _hoisted_2 = { class: "card-header border-0 pt-6" };
const _hoisted_3 = { class: "card-title w-75" };
const _hoisted_4 = { class: "d-flex align-items-center position-relative my-1" };
const _hoisted_5 = /*#__PURE__*/vue.createElementVNode("span", { class: "svg-icon svg-icon-1 position-absolute ms-6" }, [
  /*#__PURE__*/vue.createElementVNode("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    /*#__PURE__*/vue.createElementVNode("rect", {
      opacity: "0.5",
      x: "17.0365",
      y: "15.1223",
      width: "8.15546",
      height: "2",
      rx: "1",
      transform: "rotate(45 17.0365 15.1223)",
      fill: "currentColor"
    }),
    /*#__PURE__*/vue.createElementVNode("path", {
      d: "M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z",
      fill: "currentColor"
    })
  ])
], -1 /* HOISTED */);
const _hoisted_6 = ["placeholder"];
const _hoisted_7 = { class: "card-toolbar" };
const _hoisted_8 = {
  class: "d-flex justify-content-end",
  "data-kt-user-table-toolbar": "base"
};
const _hoisted_9 = { class: "card-body py-4" };
const _hoisted_10 = { class: "dataTables_wrapper dt-bootstrap4 no-footer" };
const _hoisted_11 = { class: "table-responsive" };
const _hoisted_12 = { class: "table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer" };
const _hoisted_13 = {
  key: 0,
  class: "text-start text-muted fw-bold fs-7 text-uppercase gs-0"
};
const _hoisted_14 = /*#__PURE__*/vue.createElementVNode("label", { class: "form-check form-check-sm form-check-custom form-check-solid" }, [
  /*#__PURE__*/vue.createElementVNode("input", {
    class: "form-check-input",
    type: "checkbox",
    value: ""
  })
], -1 /* HOISTED */);
const _hoisted_15 = [
  _hoisted_14
];
const _hoisted_16 = ["onClick"];
const _hoisted_17 = { key: 0 };
const _hoisted_18 = {
  key: 0,
  class: "text-start text-muted fw-bold fs-7 text-uppercase gs-0"
};
const _hoisted_19 = /*#__PURE__*/vue.createElementVNode("label", { class: "form-check form-check-sm form-check-custom form-check-solid" }, [
  /*#__PURE__*/vue.createElementVNode("input", {
    class: "form-check-input",
    type: "checkbox",
    value: ""
  })
], -1 /* HOISTED */);
const _hoisted_20 = [
  _hoisted_19
];
const _hoisted_21 = ["innerHTML"];
const _hoisted_22 = { key: 1 };
const _hoisted_23 = {
  colspan: "100000",
  class: "text-center bg-light"
};
const _hoisted_24 = { class: "fw-bolder fs-4 text-muted p-5" };
const _hoisted_25 = /*#__PURE__*/vue.createElementVNode("i", null, "No matching records found ...", -1 /* HOISTED */);
const _hoisted_26 = { key: 1 };
const _hoisted_27 = /*#__PURE__*/vue.createElementVNode("tr", null, [
  /*#__PURE__*/vue.createElementVNode("td", {
    colspan: "100000",
    class: "text-center"
  }, [
    /*#__PURE__*/vue.createElementVNode("span", { class: "spinner-border w-15px h-15px text-muted align-middle me-2" }),
    /*#__PURE__*/vue.createElementVNode("span", { class: "text-gray-600" }, "Loading...")
  ])
], -1 /* HOISTED */);
const _hoisted_28 = [
  _hoisted_27
];
const _hoisted_29 = {
  key: 0,
  class: "row"
};
const _hoisted_30 = { class: "col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-start" };
const _hoisted_31 = { class: "dataTables_length" };
const _hoisted_32 = /*#__PURE__*/vue.createElementVNode("option", { value: "10" }, "10", -1 /* HOISTED */);
const _hoisted_33 = /*#__PURE__*/vue.createElementVNode("option", { value: "25" }, "25", -1 /* HOISTED */);
const _hoisted_34 = /*#__PURE__*/vue.createElementVNode("option", { value: "50" }, "50", -1 /* HOISTED */);
const _hoisted_35 = /*#__PURE__*/vue.createElementVNode("option", { value: "100" }, "100", -1 /* HOISTED */);
const _hoisted_36 = [
  _hoisted_32,
  _hoisted_33,
  _hoisted_34,
  _hoisted_35
];
const _hoisted_37 = {
  class: "dataTables_info d-flex flex-row",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_38 = /*#__PURE__*/vue.createElementVNode("span", null, "Showing (", -1 /* HOISTED */);
const _hoisted_39 = { key: 0 };
const _hoisted_40 = { key: 1 };
const _hoisted_41 = { key: 2 };
const _hoisted_42 = { key: 3 };
const _hoisted_43 = /*#__PURE__*/vue.createElementVNode("span", null, " ) of ", -1 /* HOISTED */);
const _hoisted_44 = { class: "fw-bolder mx-1" };
const _hoisted_45 = /*#__PURE__*/vue.createElementVNode("span", null, "Total records", -1 /* HOISTED */);
const _hoisted_46 = /*#__PURE__*/vue.createElementVNode("span", null, " Showing (", -1 /* HOISTED */);
const _hoisted_47 = { key: 0 };
const _hoisted_48 = { key: 1 };
const _hoisted_49 = { key: 2 };
const _hoisted_50 = { key: 3 };
const _hoisted_51 = /*#__PURE__*/vue.createElementVNode("span", null, ") of ", -1 /* HOISTED */);
const _hoisted_52 = { class: "fw-bolder mx-1" };
const _hoisted_53 = /*#__PURE__*/vue.createElementVNode("span", null, "entries (filtered from", -1 /* HOISTED */);
const _hoisted_54 = { class: "fw-bolder mx-1" };
const _hoisted_55 = /*#__PURE__*/vue.createElementVNode("span", null, "total records)", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_pagination = vue.resolveComponent("pagination");

  return (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
    vue.createElementVNode("div", _hoisted_1, [
      vue.createCommentVNode("begin::Card header"),
      vue.createElementVNode("div", _hoisted_2, [
        vue.createCommentVNode("begin::Card title"),
        vue.createElementVNode("div", _hoisted_3, [
          vue.createCommentVNode("begin::Search"),
          vue.createElementVNode("div", _hoisted_4, [
            vue.createCommentVNode("begin::Svg Icon | path: icons/duotune/general/gen021.svg"),
            _hoisted_5,
            vue.createCommentVNode("end::Svg Icon"),
            vue.withDirectives(vue.createElementVNode("input", {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.datatable.search.value) = $event)),
              onInput: _cache[1] || (_cache[1] = (...args) => ($options.debounceSearch && $options.debounceSearch(...args))),
              class: "form-control form-control-solid w-250px ps-14",
              placeholder: $props.placeholder
            }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_6), [
              [vue.vModelText, _ctx.datatable.search.value]
            ]),
            vue.renderSlot(_ctx.$slots, "filters")
          ]),
          vue.createCommentVNode("end::Search")
        ]),
        vue.createCommentVNode("begin::Card title"),
        vue.createCommentVNode("begin::Card toolbar"),
        vue.createElementVNode("div", _hoisted_7, [
          vue.createCommentVNode("begin::Toolbar"),
          vue.createElementVNode("div", _hoisted_8, [
            vue.createCommentVNode("begin::Add user"),
            vue.renderSlot(_ctx.$slots, "table_actions"),
            vue.createCommentVNode("end::Add user")
          ]),
          vue.createCommentVNode("end::Toolbar")
        ]),
        vue.createCommentVNode("end::Card toolbar")
      ]),
      vue.createCommentVNode("end::Card header"),
      vue.createCommentVNode("begin::Card body"),
      vue.createElementVNode("div", _hoisted_9, [
        vue.createElementVNode("div", _hoisted_10, [
          vue.createElementVNode("div", _hoisted_11, [
            vue.createElementVNode("table", _hoisted_12, [
              vue.createElementVNode("thead", null, [
                vue.createElementVNode("tr", null, [
                  (_ctx.$slots.batchActions)
                    ? (vue.openBlock(), vue.createElementBlock("th", _hoisted_13, _hoisted_15))
                    : vue.createCommentVNode("v-if", true),
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.cols, (column, index) => {
                    return (vue.openBlock(), vue.createElementBlock("th", {
                      onClick: $event => ($options.orderBy(index, column)),
                      class: vue.normalizeClass(`${column.className} ` + (column.orderable ? 'cursor-pointer fw-bolder sorting' : ''))
                    }, vue.toDisplayString(column.title), 11 /* TEXT, CLASS, PROPS */, _hoisted_16))
                  }), 256 /* UNKEYED_FRAGMENT */)),
                  (_ctx.$slots.actions)
                    ? (vue.openBlock(), vue.createElementBlock("th", {
                        key: 1,
                        class: vue.normalizeClass($props.columns[0].className)
                      }, " Actions", 2 /* CLASS */))
                    : vue.createCommentVNode("v-if", true)
                ])
              ]),
              (!_ctx.processing)
                ? (vue.openBlock(), vue.createElementBlock("tbody", _hoisted_17, [
                    ($options.rows.length)
                      ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList($options.rows, (row, index) => {
                          return (vue.openBlock(), vue.createElementBlock("tr", {
                            class: vue.normalizeClass(( index % 2) ? 'odd':'even')
                          }, [
                            (_ctx.$slots.batchActions)
                              ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_18, _hoisted_20))
                              : vue.createCommentVNode("v-if", true),
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.datatable.columns, (column) => {
                              return (vue.openBlock(), vue.createElementBlock("td", {
                                class: vue.normalizeClass(column.className),
                                innerHTML: row[column.name]
                              }, null, 10 /* CLASS, PROPS */, _hoisted_21))
                            }), 256 /* UNKEYED_FRAGMENT */)),
                            vue.createElementVNode("td", null, [
                              vue.renderSlot(_ctx.$slots, "actions", { row: row })
                            ])
                          ], 2 /* CLASS */))
                        }), 256 /* UNKEYED_FRAGMENT */))
                      : (vue.openBlock(), vue.createElementBlock("tr", _hoisted_22, [
                          vue.createElementVNode("td", _hoisted_23, [
                            vue.createElementVNode("span", _hoisted_24, [
                              vue.renderSlot(_ctx.$slots, "nodata", {}, () => [
                                _hoisted_25
                              ])
                            ])
                          ])
                        ]))
                  ]))
                : (vue.openBlock(), vue.createElementBlock("tbody", _hoisted_26, _hoisted_28))
            ])
          ]),
          (_ctx.response)
            ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_29, [
                vue.createElementVNode("div", _hoisted_30, [
                  vue.createElementVNode("div", _hoisted_31, [
                    vue.createElementVNode("label", null, [
                      vue.withDirectives(vue.createElementVNode("select", {
                        class: "form-select form-select-sm form-select-solid",
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((this.datatable.length) = $event))
                      }, _hoisted_36, 512 /* NEED_PATCH */), [
                        [vue.vModelSelect, this.datatable.length]
                      ])
                    ])
                  ]),
                  vue.createElementVNode("div", _hoisted_37, [
                    (_ctx.response.recordsTotal === _ctx.response.recordsFiltered)
                      ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                          _hoisted_38,
                          (_ctx.response.recordsFiltered)
                            ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_39, vue.toDisplayString((_ctx.datatable.length * _ctx.page) - _ctx.datatable.length + 1) + " - ", 1 /* TEXT */))
                            : (vue.openBlock(), vue.createElementBlock("span", _hoisted_40, "0-")),
                          (_ctx.datatable.length * _ctx.page < _ctx.response.recordsTotal)
                            ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_41, vue.toDisplayString(_ctx.datatable.length * _ctx.page), 1 /* TEXT */))
                            : (vue.openBlock(), vue.createElementBlock("span", _hoisted_42, vue.toDisplayString(_ctx.response.recordsTotal), 1 /* TEXT */)),
                          _hoisted_43,
                          vue.createElementVNode("span", _hoisted_44, vue.toDisplayString(_ctx.response.recordsTotal), 1 /* TEXT */),
                          _hoisted_45
                        ], 64 /* STABLE_FRAGMENT */))
                      : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                          _hoisted_46,
                          (_ctx.response.recordsFiltered)
                            ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_47, vue.toDisplayString((_ctx.datatable.length * _ctx.page) - _ctx.datatable.length + 1) + "- ", 1 /* TEXT */))
                            : (vue.openBlock(), vue.createElementBlock("span", _hoisted_48, "0-")),
                          (_ctx.datatable.length * _ctx.page < _ctx.response.recordsFiltered)
                            ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_49, vue.toDisplayString(_ctx.datatable.length * _ctx.page), 1 /* TEXT */))
                            : (vue.openBlock(), vue.createElementBlock("span", _hoisted_50, vue.toDisplayString(_ctx.response.recordsFiltered), 1 /* TEXT */)),
                          _hoisted_51,
                          vue.createElementVNode("span", _hoisted_52, vue.toDisplayString(_ctx.response.recordsFiltered), 1 /* TEXT */),
                          _hoisted_53,
                          vue.createElementVNode("span", _hoisted_54, vue.toDisplayString(_ctx.response.recordsTotal), 1 /* TEXT */),
                          _hoisted_55
                        ], 64 /* STABLE_FRAGMENT */))
                  ])
                ]),
                (_ctx.response && _ctx.response.recordsFiltered)
                  ? (vue.openBlock(), vue.createBlock(_component_pagination, {
                      key: 0,
                      onPaginationChangePage: $options.changePage,
                      perPage: _ctx.datatable.length,
                      total: _ctx.response.recordsFiltered,
                      currentPage: _ctx.page,
                      from: _ctx.datatable.start,
                      processing: _ctx.processing,
                      limit: 2
                    }, null, 8 /* PROPS */, ["onPaginationChangePage", "perPage", "total", "currentPage", "from", "processing"]))
                  : vue.createCommentVNode("v-if", true)
              ]))
            : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createCommentVNode("end::Card body")
    ]),
    vue.createCommentVNode("end::Card")
  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
}

script.render = render;
script.__file = "src/Datatable.vue";

const plugin = {
    install (Vue) {
        Vue.component('datatable', script);
    }
};

module.exports = plugin;
