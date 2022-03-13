<template>
  <div class="my-custom-map-component">
    <amap-control-bar
      :position="{
        top: '8px',
        right: '10px',
      }"
    />
    <amap-tool-bar
      :position="{
        top: '108px',
        right: '40px',
      }"
    />
    <!-- <amap-scale position="RT" /> -->
    <amap-scale
      :position="{
        top: '180px',
        right: '10px',
      }"
    />
    <!-- <amap-map-type
      :position="{
        top: '250px',
        right: '10px',
      }"
    /> -->

    <el-card
      v-show="!isNavigation"
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
            <el-button @click="search(true)" :disabled="!query" type="primary">
              搜索
            </el-button>
          </el-container>
        </template>
        <template v-if="mode === 'result'">
          <div class="result-title">
            <el-button
              icon="el-icon-back"
              @click="resetSearch"
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

    <el-card
      v-show="isNavigation"
      :body-style="{
        'max-height': '520px',
        'overflow-y': 'scroll',
        padding: '4px 2px',
      }"
      class="navigate-panel"
    >
      <el-row
        type="flex"
        justify="center"
        align="middle"
        class="navigate-title"
      >
        <el-col :span="4">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-back"
            plain
            @click="hideNavCard"
          />
        </el-col>
        <el-col :span="16">地图导航详情</el-col>
        <el-col :span="4">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-close"
            plain
            @click="hideNavCard"
          />
        </el-col>
      </el-row>
      <div ref="navDetailInfo" style="padding: 2px 2px" />
    </el-card>

    <amap-marker
      ref="multiMarkers"
      v-for="poi in results"
      :key="poi.id"
      :position="[poi.location.lng, poi.location.lat]"
      :label="{
        content:
          poi === hover
            ? poi.name + '<br/>' + poi.location.lng + ' , ' + poi.location.lat
            : '',
        direction: 'bottom',
      }"
      :z-index="poi === hover ? 110 : 100"
      :visible="[null, undefined].includes(hover) || poi === hover"
      @mouseover="hover = poi"
    />

    <amap-marker
      ref="houseMarkers"
      v-for="(poi, index) in dataArray"
      :key="index"
      :position="[poi.lng1, poi.lat2]"
      :label="{
        content:
          '<h4 style=\'font-weight: bold;\'>' +
          poi.name +
          '</h4><span>' +
          poi.price +
          ' 万</span>',
        direction: 'bottom',
      }"
      :z-index="100"
    >
      <slot>
        <div>
          <el-popover
            ref="infoWindow"
            :key="navQueue.length == labelQueue.length"
            placement="top"
            width="210"
            trigger="click"
          >
            <el-descriptions size="small" :column="1" :title="poi.name">
              <!-- <template v-slot:extra>
                <el-button icon="el-icon-close" size="mini" @click="closePopover" />
              </template> -->
              <el-descriptions-item
                label="均价"
                labelStyle="word-break: keep-all;"
              >
                <span class="my-break-line-span">{{ poi.price + " 万" }}</span>
              </el-descriptions-item>
              <el-descriptions-item
                label="总价"
                labelStyle="word-break: keep-all;"
              >
                <span class="my-break-line-span">{{
                  poi.min_price + " 万 ~ " + poi.max_price + " 万"
                }}</span>
              </el-descriptions-item>
              <el-descriptions-item
                label="首付"
                labelStyle="word-break: keep-all;"
              >
                <span class="my-break-line-span">{{
                  parseInt(poi.min_price) * 0.35 +
                  " 万 ~ " +
                  parseInt(poi.max_price) * 0.35 +
                  " 万"
                }}</span>
              </el-descriptions-item>
              <el-descriptions-item
                v-for="(item, index) in poi.pathTime"
                :key="index"
                :label="item.label"
                labelStyle="word-break: keep-all;"
              >
                <div
                  v-for="(label, method) in navLabel"
                  :key="method"
                  labelStyle="word-break: keep-all;"
                >
                  <span
                    v-if="
                      ['', null, undefined, '10000元'].includes(item[method]) ||
                      label == '打车费用'
                    "
                    >{{ label }}</span
                  >
                  <span
                    v-else
                    style="
                      cursor: pointer;
                      text-decoration: underline;
                      color: blue;
                    "
                    @click="showNavCard(item.poiHouse, item.poiWork, method)"
                  >
                    {{ label }}
                  </span>
                  {{
                    " " +
                    (["", null, undefined, "10000元"].includes(item[method])
                      ? "未知"
                      : item[method])
                  }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item
                label="描述"
                labelStyle="word-break: keep-all;"
              >
                <span class="my-break-line-span">{{ poi.desc }}</span>
              </el-descriptions-item>
              <el-descriptions-item
                label="相关信息"
                labelStyle="word-break: keep-all;"
              >
                <div v-for="(item, index) in poi.info" :key="index">
                  <el-link
                    type="primary"
                    :href="item.link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {{ item.name }}
                  </el-link>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <i
              slot="reference"
              class="el-icon-s-home"
              style="font-size: 26px; color: #00cd00"
            />
          </el-popover>
        </div>
      </slot>
    </amap-marker>
  </div>
</template>

<script>
import { withAmap, loadPlugins } from "@amap/amap-vue";
import timeFormat from "@/utils/time.js";

export default {
  name: "MyCustomMapComponent",
  mixins: [withAmap],
  props: {
    dataArray: {
      type: Array,
      default: () => [],
    },
    workArray: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rawNewHouse: this.$props.dataArray,
      newHouse: this.$props.dataArray,
      workPlace: this.$props.workArray,
      mode: "search",
      query: "",
      searching: false,
      tips: [],
      results: [],
      total: 0,
      hover: null,
      // two queue for navigate result and corresponding label
      navRes: {},
      navQueue: [],
      navLabel: {
        Driving: "驾车",
        Transfer: "公交",
        taxi_cost: "打车费用",
      },
      navResMap: {
        Driving: "routes",
        Transfer: "plans",
      },
      labelRes: {},
      labelQueue: [],
      isNavigation: false,
      currNavMethod: null,

      position: null,
      pageIndex: 1,
      pageSize: 20,
      isPopover: false,
    };
  },
  async created() {
    await loadPlugins([
      "AMap.Driving", // 驾车
      "AMap.Transfer", // 公交
      "AMap.TransferPolicy",
      "AMap.Walking", // 步行
      "AMap.LngLat",
    ]);
    this.navProgram = {
      Driving: new AMap.Driving({
        map: this.$map, // 地图原生对象
        panel: this.$refs.navDetailInfo, // 展示的 HTMLElement
        extensions: "all",
        autoFitView: true, // 路径规划结束后自动调整可视范围
      }),
      Transfer: new AMap.Transfer({
        map: this.$map,
        panel: this.$refs.navDetailInfo,
        city: "上海市",
        policy: AMap.TransferPolicy.REAL_TRAFFIC,
        extensions: "all",
        autoFitView: true,
      }),
      Walking: new AMap.Walking({
        map: this.$map,
        panel: this.$refs.navDetailInfo,
        autoFitView: true,
      }),
    };
    await this.hideNavCard();
    this.roadProgram = {
      Driving: new AMap.Driving({ extensions: "all" }),
      Transfer: new AMap.Transfer({
        city: "上海市",
        policy: AMap.TransferPolicy.REAL_TRAFFIC,
        extensions: "all",
      }),
      // Walking: new AMap.Walking({}),
    };
    this.roadProgram.Transfer.leaveAt({ time: "08:30:00", date: "2022-03-01" });
    this.navMethodList = Object.keys(this.roadProgram);
    await this.updateNewHouseData(true);
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
      this.hover = null;
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
      this.$map.setCenter([poi.location.lng, poi.location.lat]);
      console.log("focus: ", this.hover);
    },
    fitView() {
      requestAnimationFrame(() => {
        this.$map.setFitView(null, false, [0, 0, 300, 0]);
      });
    },
    resetSearch() {
      this.ps.setPageIndex(1);
      this.results = [];
      this.tips = [];
      this.hover = null;
      this.total = 0;
      this.mode = "search";
    },
    // closePopover() {
    //   this.isPopover = false;
    // },
    /* 更新导航数据 */
    initNavQueue() {
      for (let index = 0; index < this.dataArray.length; index++) {
        let poi = this.rawNewHouse[index];
        let lenWork = this.workPlace.length;
        this.navRes[poi.id] = {};
        this.labelRes[poi.id] = {};
        for (let k = 0; k < lenWork; k++) {
          let item = this.workPlace[k];
          this.navRes[poi.id][item.id] = {};
          this.labelRes[poi.id][item.id] = {};
        }
      }
    },
    async updateNewHouseData(isPush) {
      if (isPush) {
        this.initNavQueue();
      }

      for (let index = 0; index < this.dataArray.length; index++) {
        let poi = this.rawNewHouse[index];
        let pathTime = {};
        let lenWork = this.workPlace.length;
        for (let k = 0; k < lenWork; k++) {
          let lenMethod = this.navMethodList.length;
          let item = this.workPlace[k];
          // push queue
          if (isPush) {
            for (let j = 0; j < lenMethod; j++) {
              this.labelQueue.push(item.label);
              this.labelRes[poi.id][item.id][this.navMethodList[j]] =
                item.label;
              await this.calPathTime(poi, item, this.navMethodList[j]);
            }
          } else {
            // pop queue when watch the end
            for (let j = 0; j < lenMethod; j++) {
              if (
                !Object.prototype.hasOwnProperty.call(
                  pathTime,
                  this.labelRes[poi.id][item.id][this.navMethodList[j]]
                )
              ) {
                pathTime[
                  this.labelRes[poi.id][item.id][this.navMethodList[j]]
                ] = {
                  label: this.labelRes[poi.id][item.id][this.navMethodList[j]],
                  poiHouse: Object.assign({}, poi),
                  poiWork: Object.assign({}, item),
                };
              }
              // 要解析 routes / plans，取最短时间
              pathTime[this.labelRes[poi.id][item.id][this.navMethodList[j]]][
                this.navMethodList[j]
              ] = this.getShortestPath(
                this.navMethodList[j],
                this.navRes[poi.id][item.id][this.navMethodList[j]]
              );
              // 要解析 taxi_cost，取最短时间
              if (
                this.navRes[poi.id][item.id][this.navMethodList[j]] &&
                this.navRes[poi.id][item.id][this.navMethodList[j]].taxi_cost
              ) {
                if (
                  !Object.prototype.hasOwnProperty.call(
                    pathTime,
                    "taxi_cost"
                  ) ||
                  parseInt(
                    pathTime[
                      this.labelRes[poi.id][item.id][this.navMethodList[j]]
                    ]["taxi_cost"]
                  ) >
                    this.navRes[poi.id][item.id][this.navMethodList[j]]
                      .taxi_cost
                ) {
                  // 没有初始值 或 有初始值但是大于已知值
                  pathTime[
                    this.labelRes[poi.id][item.id][this.navMethodList[j]]
                  ]["taxi_cost"] =
                    this.navRes[poi.id][item.id][this.navMethodList[j]]
                      .taxi_cost + "元";
                }
              } else {
                pathTime[this.labelRes[poi.id][item.id][this.navMethodList[j]]][
                  "taxi_cost"
                ] = 10000 + "元";
              }
            }
            // console.log(pathTime);
          }
        }
        this.newHouse[index].pathTime = Object.values(pathTime);
        // console.log(this.newHouse[index].id, this.newHouse[index].pathTime);
      }
    },
    async calPathTime(poi, workItem, key) {
      await this.roadProgram[key].search(
        new AMap.LngLat(poi.lng1, poi.lat2),
        new AMap.LngLat(workItem.lng1, workItem.lat2),
        (status, navRes) => {
          if (status === "complete") {
            console.log("绘制路线完成", key, navRes);
          } else {
            console.log("路线数据查询失败", key, poi, workItem, navRes);
          }
          this.navQueue.push(navRes);
          this.navRes[poi.id][workItem.id][key] = navRes;
        }
      );
      await this.roadProgram[key].clear();
    },
    getShortestPath(method, navRes) {
      let leastTime = null;
      if (navRes && navRes[this.navResMap[method]]) {
        navRes[this.navResMap[method]].forEach((route) => {
          if (leastTime == null) {
            leastTime = route.time;
          } else {
            leastTime = leastTime > route.time ? route.time : leastTime;
          }
        });
      }
      return timeFormat(leastTime);
    },
    async showNavCard(poiHouse, poiWork, method) {
      this.isNavigation = true;
      this.currNavMethod = method;
      console.log("test span", poiHouse, poiWork, method);
      Object.values(this.navProgram).forEach((navMethod) => navMethod.clear());
      await this.navProgram[method].search(
        new AMap.LngLat(poiHouse.lng1, poiHouse.lat2),
        new AMap.LngLat(poiWork.lng1, poiWork.lat2),
        (status, navRes) => {
          if (status === "complete") {
            // console.log("绘制路线完成");
          } else {
            console.log("路线数据查询失败", key, poi, workItem, navRes);
            this.$message.error("路线数据查询失败，请重试！");
          }
        }
      );
    },
    async hideNavCard() {
      this.isNavigation = false;
      Object.values(this.navProgram).forEach((navMethod) => navMethod.clear());
    },
  },
  watch: {
    pageIndex(value) {
      this.ps.setPageIndex(value);
      this.search(false);
    },
    navQueue: {
      async handler(newValue, oldValue) {
        if (this.navQueue.length == this.labelQueue.length) {
          await this.updateNewHouseData(false);
          // this.$refs.infoWindow.$forceUpdate();
        }
      },
      deep: true,
    },
    dataArray: {
      async handler(newValue, oldValue) {
        this.$data.newHouse = this.$props.dataArray;
        this.$data.navRes = {};
        this.$data.labelRes = {};
        this.$data.navQueue = [];
        this.$data.labelQueue = [];
        await this.updateNewHouseData(true);
      },
      deep: true,
    },
    workArray: {
      async handler(newValue, oldValue) {
        this.$data.workPlace = this.$props.workArray;
        this.$data.navRes = {};
        this.$data.labelRes = {};
        this.$data.navQueue = [];
        this.$data.labelQueue = [];
        await this.updateNewHouseData(true);
      },
      deep: true,
    },
    hover: {
      async handler(newValue, oldValue) {
        // add point of selection on the map
        if (this.$data.hover) {
          let temp = {
            id: "0",
            name: this.$data.hover.name,
            label: this.$data.hover.name,
            lng1: String(this.$data.hover.location.lng).toString(),
            lat2: String(this.$data.hover.location.lat).toString(),
          };
          if (this.$data.workPlace[0].id == "0") {
            this.$data.workPlace[0] = Object.assign({}, temp);
          } else {
            this.$data.workPlace.push(temp);
          }
          this.$data.workPlace.sort(function (a, b) {
            // Compare the 2 ids
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          });
        } else {
          this.$data.workPlace.splice(0, 1);
        }
        await this.updateNewHouseData(true);
      },
      deep: true,
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

  .navigate-panel {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 280px;
    display: flex;
    flex-direction: column;

    .navigate-title {
      .count {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
