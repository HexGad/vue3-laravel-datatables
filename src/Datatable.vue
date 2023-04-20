<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title w-75">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <!--begin::Svg Icon | path: icons/duotune/general/gen021.svg-->
          <span class="svg-icon svg-icon-1 position-absolute ms-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1"
                                  transform="rotate(45 17.0365 15.1223)" fill="currentColor"/>
                            <path
                                d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                                fill="currentColor"/>
                        </svg>
                    </span>
          <!--end::Svg Icon-->
          <input type="text"
                 v-model="datatable.search.value"
                 @input="debounceSearch"
                 class="form-control form-control-solid w-250px ps-14"
                 :placeholder="placeholder" />

          <slot name="filters"></slot>

        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end" data-kt-user-table-toolbar="base">
          <!--begin::Add user-->
          <slot name="table_actions"></slot>
          <!--end::Add user-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->
    <!--begin::Card body-->
    <div class="card-body py-4">

      <div class="dataTables_wrapper dt-bootstrap4 no-footer">
        <div class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
            <thead>
            <tr>
              <th v-if="$slots.batchActions"
                  class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <label class="form-check form-check-sm form-check-custom form-check-solid">
                  <input class="form-check-input" type="checkbox" value="">
                </label>
              </th>
              <th
                  @click="orderBy(index, column)"
                  :class="`${column.className} ` + (column.orderable ? 'cursor-pointer fw-bolder sorting' : '')"
                  v-for="(column, index) in cols"
              >{{ column.title }}
              </th>

              <th v-if="$slots.actions" :class="columns[0].className"> Actions</th>
            </tr>
            </thead>
            <tbody v-if="!processing">
            <tr v-if="rows.length" :class="( index % 2) ? 'odd':'even'" v-for="(row, index) in rows">
              <td v-if="$slots.batchActions"
                  class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <label class="form-check form-check-sm form-check-custom form-check-solid">
                  <input class="form-check-input" type="checkbox" value="">
                </label>
              </td>
              <td v-for="column in datatable.columns"
                  :class="column.className"
                  v-html="row[column.name]">
              </td>
              <td>
                <slot name="actions" :row="row"></slot>
              </td>
            </tr>
            <tr v-else>
              <td colspan="100000" class="text-center bg-light">
                                    <span class="fw-bolder fs-4 text-muted p-5">
                                        <slot name="nodata">
                                            <i>No matching records found ...</i>
                                        </slot>
                                    </span>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="100000" class="text-center">
                <span class="spinner-border w-15px h-15px text-muted align-middle me-2"></span>
                <span class="text-gray-600">Loading...</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="row" v-if="response">
          <div
              class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-start">
            <div class="dataTables_length">
              <label>
                <select class="form-select form-select-sm form-select-solid" v-model="this.datatable.length">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
            </div>
            <div class="dataTables_info d-flex flex-row" role="status" aria-live="polite">
              <template v-if="response.recordsTotal === response.recordsFiltered">
                <span>Showing (</span>
                <span v-if="response.recordsFiltered">{{ (datatable.length * page) - datatable.length + 1 }} - </span>
                <span v-else>0-</span>
                <span v-if="datatable.length * page < response.recordsTotal">{{ datatable.length * page }} </span>
                <span v-else>{{ response.recordsTotal }}</span>
                <span> ) of </span>
                <span class="fw-bolder mx-1"> {{ response.recordsTotal }} </span>
                <span>Total records</span>
              </template>
              <template v-else>
                <span> Showing (</span>
                <span v-if="response.recordsFiltered">{{ (datatable.length * page) - datatable.length + 1 }}- </span>
                <span v-else>0-</span>

                <span v-if="datatable.length * page < response.recordsFiltered">{{ datatable.length * page }}</span>
                <span v-else>{{ response.recordsFiltered }}</span>
                <span>) of </span>
                <span class="fw-bolder mx-1">{{ response.recordsFiltered }}</span>
                <span>entries (filtered from</span>
                <span class="fw-bolder mx-1">{{ response.recordsTotal }}</span>
                <span>total records)</span>
              </template>
            </div>
          </div>
          <pagination
              @pagination-change-page="changePage"
              v-if="response && response.recordsFiltered"
              :perPage="datatable.length"
              :total="response.recordsFiltered"
              :currentPage.sync="page"
              :from="datatable.start"
              :processing="processing"
              :limit="2"
          ></pagination>
        </div>
      </div>

    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script>
import pagination from "./pagination.vue";

export default {
  name: "Datatable",
  components: {pagination},
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
      const existingFilter = this.datatable.filters.find(f => f.id === id)
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
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        if (this.page !== 1) {
          this.page = 1;
        } else {
          this.getData();
        }
      }, 800)
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
      })
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

      this.page = 1
    },
    ['datatable.order']: {
      deep: true,
      handler(datatable) {
        if (this.page === 1)
          this.getData();

        this.page = 1
      }
    }
  }
}
</script>
