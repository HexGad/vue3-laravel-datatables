<template>
    <div class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-end">
        <div class="dataTables_paginate paging_simple_numbers" id="kt_table_users_paginate">
            <ul class="pagination">
                <li class="paginate_button page-item previous" :class="{disabled: currentPage === 1 || processing}">
                    <a @click="previousPage" class="page-link cursor-pointer">
                        <i class="previous"></i>
                    </a>
                </li>

                <li class="paginate_button page-item cursor-pointer" v-for="(page, key) in pageRange" :key="key" :class="{ 'active': page === currentPage, disabled:processing }">
                    <a aria-controls="kt_table_users" data-dt-idx="1" tabindex="0" @click="selectPage(page)"
                       class="page-link"> {{ page }} </a>
                </li>


                <li class="paginate_button page-item next" :class="{disabled: currentPage === lastPage || processing}">
                    <a @click="nextPage" tabindex="0" class="page-link cursor-pointer ">
                        <i class="next"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
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
}
</script>
