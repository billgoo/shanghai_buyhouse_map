<template>
  <div class="my-custom-map-component">
    <amap-marker
      ref="markers"
      v-for="poi in results"
      :key="poi.id"
      :position="[poi.location.lng, poi.location.lat]"
      :label="{
        content:
          poi === hover
            ? poi.name + '<br />' + poi.location.lng + ' , ' + poi.location.lat
            : '',
        direction: 'bottom',
      }"
      :z-index="poi === hover ? 110 : 100"
      @mouseover="hover = poi"
      @mouseout="hover = null"
    />

    <amap-marker
      v-if="position"
      :position.sync="position"
      :label="{
        content:
          hover &&
          position[0] == hover.location.lng &&
          position[1] == hover.location.lat
            ? ''
            : 'lng1: ' + position[0] + ' , lat2: ' + position[1],
        direction: 'bottom',
      }"
      :z-index="120"
      @dblclick="position = null"
      @rightclick="position = null"
      draggable
    >
      <slot>
        <i class="el-icon-location" style="font-size: 34px; color: #f56c6c" />
      </slot>
    </amap-marker>

    <el-card
      :body-style="{
        'max-height': '450px',
        'overflow-y': 'scroll',
        padding: '0 12px 24px',
      }"
      class="result-panel"
    >
      <template
        slot="header"
        :style="{
          padding: '0 12px',
        }"
      >
        <template v-if="mode === 'search'">
          <el-container compact style="display: flex">
            <el-autocomplete
              v-model="query"
              :fetch-suggestions="autoComplete"
              placeholder="输入关键词"
              style="flex: 1"
              :trigger-on-focus="false"
            />
            <el-button
              @click="search(true)"
              @tap="search(true)"
              :disabled="!query"
              type="primary"
            >
              搜索
            </el-button>
          </el-container>
        </template>
        <template v-if="mode === 'result'">
          <div class="result-title">
            <el-button
              icon="el-icon-back"
              @click="reset"
              @tap="reset"
              style="margin-right: 6px"
            />
            <span class="count">共 {{ searching ? "..." : total }} 条结果</span>
          </div>
        </template>
      </template>

      <el-container v-if="mode === 'result'" class="result-list">
        <el-header
          style="display: flex; justify-content: center; align-items: center"
          height="20px"
        >
          <el-pagination
            v-if="total > 0"
            v-model="pageIndex"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            small
          />
        </el-header>
        <el-main>
          <el-table
            :data="results"
            @cell-click="focus"
            :show-header="false"
            show-overflow-tooltip
          >
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  <el-descriptions
                    :title="scope.row.name"
                    style="cursor: pointer; text-align: center"
                    :colon="false"
                    size="small"
                  >
                    <el-descriptions-item
                      style="cursor: pointer; text-align: center"
                    >
                      {{ scope.row.address }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer
          style="display: flex; justify-content: center; align-items: center"
          height="20px"
        >
          <el-pagination
            v-if="total > 0"
            v-model="pageIndex"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            small
          />
        </el-footer>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { withAmap, loadPlugins } from "@amap/amap-vue";

export default {
  name: "MyCustomMapComponent",
  mixins: [withAmap],
  data() {
    return {
      mode: "search",
      query: "",
      searching: false,
      tips: [],
      results: [],
      total: 0,
      hover: null,
      position: null,
      pageIndex: 1,
      pageSize: 20,
    };
  },
  async mounted() {
    await loadPlugins(["AMap.AutoComplete", "AMap.PlaceSearch"]);
    this.ps = new AMap.PlaceSearch({
      pageSize: this.pageSize,
    });
    this.ac = new AMap.AutoComplete();
  },
  methods: {
    async search(clear = false) {
      this.mode = "result";

      if (clear) {
        this.results = [];
        this.total = 0;
        this.pageIndex = 1;
        this.ps.setPageIndex(1);
      }

      this.searching = true;
      const { query } = this;
      this.ps.search(query, (status, result) => {
        this.searching = false;
        if (query !== this.query) return;

        if (status === "complete" && result.poiList) {
          this.results = result.poiList.pois;
          this.total = result.poiList.count;
          this.fitView();
        } else {
          this.results = [];
          this.total = 0;
        }
      });
    },
    async autoComplete(kw, cb) {
      if (!kw) {
        this.tips = [];
      } else {
        this.ac.search(kw, (status, result) => {
          if (kw !== this.query) return;
          if (status === "complete" && result.tips) {
            // this.tips = Array.from(
            //   new Set(
            //     result.tips.map(
            //       (tip) => tip.name + "(" + tip.district.slice(0, 5) + ")"
            //     )
            //   )
            // );
            this.tips = Array.from(new Set(result.tips.map((tip) => tip.name)));
          } else {
            this.tips = [];
          }
        });
      }
      cb(this.tips.map((item) => ({ value: item })));
    },
    focus(poi) {
      this.hover = poi;
      this.position = [poi.location.lng, poi.location.lat];
      this.$map.setCenter([poi.location.lng, poi.location.lat]);
    },
    fitView() {
      requestAnimationFrame(() => {
        this.$map.setFitView(null, false, [0, 0, 300, 0]);
      });
    },
    reset() {
      this.ps.setPageIndex(1);
      this.results = [];
      this.tips = [];
      this.total = 0;
      this.mode = "search";
      this.position = null;
    },
  },
  watch: {
    pageIndex(value) {
      this.ps.setPageIndex(value);
      this.search(false);
    },
  },
};
</script>

<style lang="less" scoped>
.my-custom-map-component {
  .result-panel {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 280px;
    display: flex;
    flex-direction: column;

    .result-list {
      width: 100%;
    }

    .result-list.ant-list-loading {
      min-height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .result-title {
      .count {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
