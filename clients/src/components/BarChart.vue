<template>
  <q-card class="shadow-15 block" style="border-radius: 14px;">
    <Caption title="Скачивания приложения" icon-name="add_reaction"></Caption>
    <q-card-section style="padding-top: 0px;">
      <div class="row">
        <div class="col-auto">
          <div class="text-subtitle2">Скачиваний сегодня: {{ todayStats.downloadCountToday }}</div>
        </div>
        <q-separator class="q-mr-lg q-ml-lg" vertical inset></q-separator>
        <div class="col-auto">
          <div class="text-subtitle2">Регистраций сегодня: {{ todayStats.registrationCountToday }}</div>
        </div>
      </div>

    </q-card-section>

    <q-card-section>
      <div class="row">
        <div class="col-8" style="display: flex; flex-direction: column;">
          <div>
            <div class="text-h6 inline">Динамика скачивания приложения за
              <div class="inline">
                <q-select class="inline" style="margin-left: 24px;" borderless v-model.lazy="yearModel"
                  @update:model-value="changeDownloadData" :options="getYearList">
                </q-select>
              </div>
            </div>
            <div class="inline" v-if="downloads.length > 0">
              <q-btn flat dense icon="download" size="m" class="mr-10" @click="SaveImage('downloads')" :color="'grey-8'">
                <q-tooltip>Скачать</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="text-subtitle2">Всего скачиваний за {{ this.yearModel }}: {{ this.downloads.length }}</div>

          <v-chart v-if="downloads.length > 0" class="chart" ref="downloads" :option="downloadOptions" autoresize
            style="" />
          <div v-else style="display: flex; justify-content: center; align-items: center; flex-grow: 3">
            <div>
              <img class="image-center" src="../resources/no_data.svg" />
              <div class="text-subtitle2">За {{ yearModel }} данных не обнаружено </div>
            </div>
          </div>
        </div>


        <div class="col-4" style="display: flex; flex-direction: column; min-width: 300px;">
          <div>
            <div class="text-h6 inline">Возраст зарегистрированных пользователей</div>
            <div class="inline" v-if="ageRegData.series[0].data.length > 0">
              <q-btn flat dense icon="download" size="m" class="q-pl-md" @click="SaveImage('age')" :color="'grey-8'">
                <q-tooltip>Скачать</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="text-subtitle2">Всего регистраций за {{ this.yearModel }}: {{ this.countOfRegUsers }}</div>

          <v-chart v-if="ageRegData.series[0].data.length > 0" class="chart" ref="age" :option="ageRegData"
            :key="Math.random(1000)" autoresize />
          <div v-else style="display: flex; justify-content: center; align-items: center; flex-grow: 3">
            <div>
              <img class="image-center" src="../resources/no_data.svg" />
              <div class="text-subtitle2">За {{ yearModel }} данных не обнаружено </div>
            </div>
          </div>

        </div>
      </div>
    </q-card-section>

  </q-card>






  <q-card class="shadow-15 block" style="border-radius: 14px;">
    <Caption title="Школы" icon-name="school"></Caption>
    <q-card-section>
      <div class="row justify-between">
        <div class="col-8" style="display: flex; flex-direction: column;">
          <div>
            <div class="text-h6 inline">Динамика просмотра школ за
              <div class="inline">
                <q-select class="inline" style="margin-left: 24px;" borderless v-model.lazy="yearModelSchool"
                  @update:model-value="changeSchoolData" :options="getYearList">
                </q-select>
              </div>
            </div>
            <div class="inline" v-if="currentPeriodSchoolData.length > 0">
              <q-btn flat dense icon="download" size="m" class="mr-10" @click="SaveImage('schools')" :color="'grey-8'">
                <q-tooltip>Скачать</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="text-subtitle2">Всего за {{ this.yearModelSchool }} : {{ this.getCountOfSchoolYearWatch }}</div>
          <v-chart v-if="currentPeriodSchoolData.length > 0" class="chart" ref="schools" autoresize
            :option="schoolOptions" />

          <div v-else style="display: flex; justify-content: center; align-items: center; flex-grow: 3">
            <div>
              <img class="image-center" src="../resources/no_data.svg" />
              <div class="text-subtitle2">За {{ yearModelSchool }} данных не обнаружено </div>
            </div>
          </div>
        </div>


        <div class="col-4" style="display: flex; flex-direction: column;">
          <div>
            <div class="text-h6 inline">Популярные</div>
            <q-btn flat class="inline" :color="'grey-8'" icon="download" label="CSV" no-caps
              @click="exportTable(schoolCols, schoolRows)">
              <q-tooltip>Экспортировать в CSV</q-tooltip>
            </q-btn>
          </div>
          <div class="row justify-between">
            <div class="col-5">
              <q-input style=" padding-bottom:0px" bottom-slots borderless v-model="search" label="Поиск по названию">
                <template v-slot:prepend>
                  <q-icon name="search"></q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <q-separator></q-separator>
          <q-table flat borderless separator="cell" row-key="name" :rows="getSchoolRows" :columns="schoolCols"
            color="primary" no-data-label="Ничего не найдено">
          </q-table>
        </div>
      </div>
    </q-card-section>
  </q-card>














  <q-card class="shadow-15 block" style="border-radius: 14px;">
    <Caption title="Факты" icon-name="school"></Caption>
    <q-card-section>
      <div class="row justify-between">
        <div class="col-8" style="display: flex; flex-direction: column;">
          <div>
            <div class="text-h6 inline">Динамика просмотра фактов за
              <div class="inline">
                <q-select class="inline" style="margin-left: 24px;" borderless v-model.lazy="yearModelFact"
                  @update:model-value="changeFectData" :options="getYearList">
                </q-select>
              </div>
            </div>
            <div class="inline" v-if="currentPeriodFactData.length > 0">
              <q-btn flat dense icon="download" size="m" class="mr-10" @click="SaveImage('facts')" :color="'grey-8'">
                <q-tooltip>Скачать</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="text-subtitle2">Всего за {{ this.yearModelFact }} : {{ this.getCountOfFactYearWatch }}</div>
          <v-chart v-if="currentPeriodFactData.length > 0" class="chart" ref="facts" autoresize
            :option="factOptions" />

          <div v-else style="display: flex; justify-content: center; align-items: center; flex-grow: 3">
            <div>
              <img class="image-center" src="../resources/no_data.svg" />
              <div class="text-subtitle2">За {{ yearModelFact }} данных не обнаружено </div>
            </div>
          </div>
        </div>


        <div class="col-4" style="display: flex; flex-direction: column;">
          <div>
            <div class="text-h6 inline">Популярные</div>
            <q-btn flat class="inline" :color="'grey-8'" icon="download" label="CSV" no-caps
              @click="exportTable(factCols, facts)">
              <q-tooltip>Экспортировать в CSV</q-tooltip>
            </q-btn>
          </div>
          <div class="row justify-between">
            <div class="col-5">
              <q-input style=" padding-bottom:0px" bottom-slots borderless v-model="searchFact" label="Поиск по названию">
                <template v-slot:prepend>
                  <q-icon name="search"></q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <q-separator></q-separator>
          <q-table flat borderless separator="cell" row-key="name" :rows="getFcatRows" :columns="factCols" color="primary"
            no-data-label="Ничего не найдено">
          </q-table>
        </div>
      </div>
    </q-card-section>
  </q-card>

















  <q-card class="shadow-15 block" style="border-radius: 14px;">
    <Caption title="Факты" icon-name="school"></Caption>
    <q-card-section>
      <div class="row justify-between">
        <div class="col-8" style="display: flex; flex-direction: column;">
          <div>
            <div class="text-h6 inline">Динамика просмотра событий за
              <div class="inline">
                <q-select class="inline" style="margin-left: 24px;" borderless v-model.lazy="yearModelEvent"
                  @update:model-value="changeEventData" :options="getYearList">
                </q-select>
              </div>
            </div>
            <div class="inline" v-if="currentPeriodEventData.length > 0">
              <q-btn flat dense icon="download" size="m" class="mr-10" @click="SaveImage('events')" :color="'grey-8'">
                <q-tooltip>Скачать</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="text-subtitle2">Всего за {{ this.yearModelEvent }} : {{ this.getCountOfEventYearWatch }}</div>
          <v-chart v-if="currentPeriodEventData.length > 0" class="chart" ref="events" autoresize
            :option="eventOptions" />

          <div v-else style="display: flex; justify-content: center; align-items: center; flex-grow: 3">
            <div>
              <img class="image-center" src="../resources/no_data.svg" />
              <div class="text-subtitle2">За {{ yearModelEvent }} данных не обнаружено </div>
            </div>
          </div>
        </div>


        <div class="col-4" style="display: flex; flex-direction: column;">
          <div>
            <div class="text-h6 inline">Популярные</div>
            <q-btn flat class="inline" :color="'grey-8'" icon="download" label="CSV" no-caps
              @click="exportTable(eventCols, events)">
              <q-tooltip>Экспортировать в CSV</q-tooltip>
            </q-btn>
          </div>
          <div class="row justify-between">
            <div class="col-5">
              <q-input style=" padding-bottom:0px" bottom-slots borderless v-model="searchEvent"
                label="Поиск по названию">
                <template v-slot:prepend>
                  <q-icon name="search"></q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <q-separator></q-separator>
          <q-table flat borderless separator="cell" row-key="name" :rows="getEventRows" :columns="eventCols"
            color="primary" no-data-label="Ничего не найдено">
          </q-table>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import Caption from './Chatrts/Caption.vue';
import { use } from 'echarts/core';
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { api } from "../boot/axios";
import VueCookies from "vue-cookies";
import {
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart
} from "echarts/charts";
import {
  GridComponent,
  PolarComponent,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DatasetComponent,
  ToolboxComponent,
  DataZoomComponent
} from "echarts/components";
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide } from 'vue';
import { exportFile } from 'quasar';
use([
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
  GridComponent,
  PolarComponent,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DatasetComponent,
  CanvasRenderer,
  SVGRenderer,
  ToolboxComponent,
  DataZoomComponent
]);
provide(THEME_KEY, 'light');

</script>

<script>
export default {
  components: {
    Caption,
  },
  beforeMount() {
    //Получение массива возможных диапазонов возростов пользователей
    this.getAgeParams();

    //Устанавливаем значение круговой диаграммы
    this.getUsers();
    this.getDownload();
    this.getSchool();
    this.getFact();
    this.getEvent();


    //Заполняем неизменную статистику
    //Зарегистрировавшиеся сегодня
    this.getTodayRegUsers();
    //Скачавшие сегодня
    this.getTodayDownload();

    this.downloadOptions.xAxis.data = Object.values(this.mounth);
    this.schoolOptions.xAxis.data = Object.values(this.mounth);
    this.factOptions.xAxis.data = Object.values(this.mounth);
    this.eventOptions.xAxis.data = Object.values(this.mounth);

  },
  data() {
    return {
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      mounth: {
        1: "Январь",
        2: "Февраль",
        3: "Март",
        4: "Апрель",
        5: "Май",
        6: "Июнь",
        7: "Июль",
        8: "Август",
        9: "Сентябрь",
        10: "Октябрь",
        11: "Ноябрь",
        12: "Дакабрь"
      },
      schools: [],
      facts: [],
      events: [],

      /**********************************************************
        *         Статистика Скачиваний и регистаций
        ***********************************************************/
      startYear: "2022",
      ageParams: [],
      registredUsers: [],
      countOfRegUsers: 0,
      //Данные для круговой диаграммы
      ageRegData: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: this.ageParams,
        },
        series: [
          {
            name: 'Traffic Sources',
            type: 'pie',
            radius: '70%',
            center: ['50%', '40%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 1)',
              },
            },
          },
        ],
      },
      downloads: [],

      //Данные о скачиваниях
      downloadOptions: {
        grid: { top: 20, right: 40, bottom: 80, left: 40 },
        legend: {
          bottom: 0,
          right: 0,
          textStyle: {
            color: '#676767'
          }
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'grey'
            },
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: this.$q.dark.isActive ? 'white' : '#676767'
          },
        },
        series: [],
        tooltip: {
          trigger: "axis"
        }
      },


      /**********************************************
       * ШКОЛЫ
       ***************************************************/
      allYearsSchoolData: [],
      currentPeriodSchoolData: [],
      getCountOfSchoolYearWatch: 0,

      schoolOptions: {
        grid: { top: 20, right: 40, bottom: 80, left: 40 },
        legend: {
          bottom: 0,
          right: 0,
          textStyle: {
            color: '#676767'
          }
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'grey'
            },
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: this.$q.dark.isActive ? 'white' : '#676767'
          },
        },
        series: this.currentPeriodSchoolData,
        tooltip: {
          trigger: "axis"
        }
      },
      search: "",
      schoolCols: [
        {
          name: "name",
          label: "Название школы",
          align: "left",
          field: "name",
          sortable: true,
        },
        {
          name: "view",
          label: "Просмотры",
          align: "left",
          field: 'viewCount',
          sortable: true,
        }],
      /**********************************************
       *ФАКТЫ
       ***************************************************/
      searchFact: "",
      allYearsfactData: [],
      currentPeriodFactData: [],
      getCountOfFactYearWatch: 0,
      factOptions: {
        grid: { top: 20, right: 40, bottom: 80, left: 40 },
        legend: {
          bottom: 0,
          right: 0,
          textStyle: {
            color: '#676767'
          }
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'grey'
            },
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: this.$q.dark.isActive ? 'white' : '#676767'
          },
        },
        series: this.currentPeriodSchoolData,
        tooltip: {
          trigger: "axis"
        }
      },
      factCols: [
        {
          name: "name",
          label: "Название факта",
          align: "left",
          field: "fact_name",
          sortable: true,
        },
        {
          name: "view",
          label: "Просмотры",
          align: "left",
          field: 'viewCount',
          sortable: true,
        },
        {
          name: "like",
          label: "Лайки",
          align: "left",
          field: 'likeCount',
          sortable: true,
        }],
      /**********************************************
       *СОБЫТИЯ
       ***************************************************/
      searchEvent: "",
      allYearsEventData: [],
      currentPeriodEventData: [],
      getCountOfEventYearWatch: 0,
      eventOptions: {
        grid: { top: 20, right: 40, bottom: 80, left: 40 },
        legend: {
          bottom: 0,
          right: 0,
          textStyle: {
            color: '#676767'
          }
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'grey'
            },
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: this.$q.dark.isActive ? 'white' : '#676767'
          },
        },
        series: this.currentPeriodSchoolData,
        tooltip: {
          trigger: "axis"
        }
      },
      eventCols: [
        {
          name: "name",
          label: "Название события",
          align: "left",
          field: "name",
          sortable: true,
        },
        {
          name: "view",
          label: "Просмотры",
          align: "left",
          field: 'viewCount',
          sortable: true,
        },
      ],



      /**********************************************************
       *                  Общая статистика
       ***********************************************************/
      todayStats: {
        downloadCountToday: 0,
        registrationCountToday: 0,
      },

      yearModel: new Date().getFullYear().toString(),
      yearModelSchool: new Date().getFullYear().toString(),
      yearModelFact: new Date().getFullYear().toString(),
      yearModelEvent: new Date().getFullYear().toString(),

    };
  },
  computed: {
    getYearList() {
      let yearArray = [];
      let currentYear = new Date().getFullYear().toString();
      for (let year = this.startYear; year <= currentYear; year++) {
        yearArray.push(year);
      }
      return yearArray;
    },
    getSchoolRows() {
      return this.getRows(this.schools, this.search);
    },
    getFcatRows() {
      return this.getRows(this.facts, this.searchFact, 'fact_name');
    },
    getEventRows() {

      return this.getRows(this.events, this.searchEvent);
    }

  },
  methods: {
    getRows(rows, search, field = 'name') {
      if (search !== '') {
        let text = search;
        let result = [];
        [rows.map(function (r) {
          if (r[field].toString().toLowerCase().includes(text.toString().toLowerCase())) {
            result.push(r);
          }
        })]
        return result;
      }
      return rows;
    },
    exportTable(columns, rows) {
      const content = [columns.map(col => this.wrapCsvValue(col.label))].concat(
        rows.map(row => columns.map(col => this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        $q.notify({
          message: 'Ошибка загрузки',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    wrapCsvValue(val, formatFn) {
      let formatted = formatFn !== void 0
        ? formatFn(val)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')

      return `"${formatted}"`
    },

    /**
     * Получение возростных критериев
     */
    async getAgeParams() {
      try {
        const res = await api.get("auth/getAgeParams");
        this.rows = res.data;
        this.ageParams = res.data.ageParams;
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Формирование данных для кроговой диаграммы
     * с возрастами зарегистрированных юзеров
     */
    formDataForPie() {
      this.countOfRegUsers = 0;
      let data = [];
      this.ageParams.forEach(param => {
        data.push({ value: 0, name: param })
      })

      this.registredUsers.forEach(user => {
        let index = this.ageParams.indexOf(user.age);
        if (index != -1) {
          data[index].value++;
          this.countOfRegUsers++;
        }
      })
      let check_for_null = true;
      data.forEach(element => {

        if (element.value != 0) {
          check_for_null = false;

        }
      });
      if (check_for_null) {
        data = [];
      }

      return data;
    },

    /**
     * Получение всех
     * зарегистрированных
     * пользователей
     */
    async getUsers() {

      let startYear = Number(this.yearModel == "все время" ? this.startYear : this.yearModel) - 1;
      let endYear = Number(this.yearModel == "все время" ? new Date().getFullYear().toString() : this.yearModel) + 1;
      let start = startYear + '-12-31';
      let end = endYear + '-01-01';
      try {
        const res = await api.post("auth/getCreated", {
          start: start,
          end: end,
        }, {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token"),
          },
        });

        this.registredUsers = res.data;
        this.ageRegData.series[0].data = this.formDataForPie();
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Статистика регистрации по сегодняшнему дню
     */
    async getTodayRegUsers() {
      let date = new Date();
      let currentDayStart = String(date.getDate() - 1).padStart(2, '0');
      let currentDayFin = String(date.getDate() + 1).padStart(2, '0');
      let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
      let currentYear = date.getFullYear();
      try {
        const res = await api.post("auth/getCreated", {
          start: `${currentYear}-${currentMonth}-${currentDayStart}`,
          end: `${currentYear}-${currentMonth}-${currentDayFin}`,
        },
          {
            headers: {
              Authorization: "Bearer " + VueCookies.get("token"),
            },
          });
        this.todayStats.registrationCountToday = res.data.length;

      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Получение сегодняшних скачиваний
     */
    async getTodayDownload() {
      let date = new Date();
      let currentDayStart = String(date.getDate() - 1).padStart(2, '0');
      let currentDayFin = String(date.getDate() + 1).padStart(2, '0');
      let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
      let currentYear = date.getFullYear();
      try {
        const res = await api.post("api/user/getCreated/", {
          start: `${currentYear}-${currentMonth}-${currentDayStart}`,
          end: `${currentYear}-${currentMonth}-${currentDayFin}`,
        },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          });

        this.todayStats.downloadCountToday = res.data.length;

      } catch (error) {
        this.onError(error);
      }
    },




    /**
     * Получение скачиваний за периуд
     */
    async getDownload() {
      let startYear = Number(this.yearModel == "все время" ? this.startYear : this.yearModel) - 1;
      let endYear = Number(this.yearModel == "все время" ? new Date().getFullYear().toString() : this.yearModel) + 1;
      let start = startYear + '-12-31';
      let end = endYear + '-01-01';
      try {
        const res = await api.post("api/user/getCreated/", {
          start: start,
          end: end,
        },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          });

        this.downloads = res.data;
        this.downloadOptions.series = this.formDownloadDataForGraph(startYear + 1, endYear - 1);

      } catch (error) {
        this.onError(error);
      }
    },

    formDownloadDataForGraph(startYear, endYear) {
      //Список лет
      let yearArray = [];
      let yearParams = [];
      for (let year = startYear; year <= endYear; year++) {
        yearArray.push(year.toString());
        yearParams.push({ year: year.toString(), values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
      }
      this.downloads.forEach(load => {
        let dateSplits = load.create_date.split('-');
        let index = yearArray.indexOf(dateSplits[0].toString());
        if (index != -1) {
          yearParams[index].values[Number(dateSplits[1]) - 1]++;
        }
      })

      //Формирование структуры
      let data = [];
      yearParams.forEach(element => {
        data.push(
          {
            name: element.year,
            data: element.values,
            type: "bar",
            smooth: true,
          });
      });
      return data;

    },
    /****************************************************************
     *              СТАТИСТИКА ШКОЛ
    ******************************************************************/
    /**
        * Получение списка все школ
        *
        */
    async getSchool() {
      try {
        const res = await api.get("api/school", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        let sch = res.data;

        sch.forEach(sch => {

          if (sch.views == null) {
            sch.views = [];
            sch['viewCount'] = 0;
          }
          else {
            let views = [];
            Object.values(sch.views).forEach(view => {
              views.push(view.views[0]);
            })
            sch.views = views;
            sch['viewCount'] = views.length;
          }
        });

        this.schools = sch;
        this.allYearsSchoolData = this.getSchoolsInPeriodDiagramm();
        this.currentPeriodSchoolData = this.setSchoolsCurrent();
        this.schoolOptions.series = this.currentPeriodSchoolData;
      } catch (error) {
        this.onError(error);
      }
    },

    getSchoolsInPeriodDiagramm() {
      let currentYear = new Date().getFullYear().toString();
      let startYear = Number(this.startYear) - 1;
      let endYear = Number(currentYear) + 1;
      let start = startYear + '-12-31';
      let end = endYear + '-01-01';
      let startDate = new Date(start);
      let endDate = new Date(end);

      let schoolParams = [];
      let yearArray = [];
      for (let year = this.startYear; year <= currentYear; year++) {
        yearArray.push(year.toString());
        schoolParams.push({ year: year.toString(), values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
      }



      this.schools.forEach(sc => {
        sc.views.forEach(viw => {
          let viewDate = new Date(viw);
          if (viewDate > startDate && viewDate < endDate) {
            let dateSplits = viw.split('-');
            let index = yearArray.indexOf(dateSplits[0].toString());
            if (index != -1) {
              schoolParams[index].values[Number(dateSplits[1]) - 1]++;
            }
          }
        })
      })



      let data = [];
      schoolParams.forEach(element => {
        data.push(
          {
            name: element.year,
            data: element.values,
            type: "bar",
            smooth: true,
          });
      });

      return data;
    },


    setSchoolsCurrent() {
      let res = [];
      this.allYearsSchoolData.forEach(el => {
        if (el.name == this.yearModelSchool) {
          res.push(el);
        }
      })
      let counter = 0;
      res[0].data.forEach(el => {
        counter += el;

      })
      this.getCountOfSchoolYearWatch = counter;
      return res;
    },






    /***************************************************
     *                      ФАКТЫ
     ***************************************************/

    /**
           * Получение списка все школ
           *
           */
    async getFact() {
      try {
        const res = await api.get("api/fact", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        let sch = res.data;

        sch.forEach(sch => {
          let likeCount = 0;
          sch['viewCount'] = 0;
          if (sch.views == null) {
            sch.views = [];
          }
          else {
            let views = [];

            Object.values(sch.views).forEach(view => {
              views.push(view.views[0]);
              if (view.like)
                likeCount++;
            })
            sch.views = views;
            sch['viewCount'] = views.length;
          }
          sch['likeCount'] = likeCount;
        });

        this.facts = sch;
        this.allYearsfactData = this.getFactsInPeriodDiagramm();
        this.currentPeriodFactData = this.setFactsCurrent();
        this.factOptions.series = this.currentPeriodFactData;
      } catch (error) {
        this.onError(error);
      }
    },

    getFactsInPeriodDiagramm() {
      let currentYear = new Date().getFullYear().toString();
      let startYear = Number(this.startYear) - 1;
      let endYear = Number(currentYear) + 1;
      let start = startYear + '-12-31';
      let end = endYear + '-01-01';
      let startDate = new Date(start);
      let endDate = new Date(end);

      let factParams = [];
      let yearArray = [];
      for (let year = this.startYear; year <= currentYear; year++) {
        yearArray.push(year.toString());
        factParams.push({ year: year.toString(), values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
      }



      this.facts.forEach(sc => {
        sc.views.forEach(viw => {
          let viewDate = new Date(viw);
          if (viewDate > startDate && viewDate < endDate) {
            let dateSplits = viw.split('-');
            let index = yearArray.indexOf(dateSplits[0].toString());
            if (index != -1) {
              factParams[index].values[Number(dateSplits[1]) - 1]++;
            }
          }
        })
      })



      let data = [];
      factParams.forEach(element => {
        data.push(
          {
            name: element.year,
            data: element.values,
            type: "bar",
            smooth: true,
          });
      });

      return data;
    },


    setFactsCurrent() {
      let res = [];
      this.allYearsfactData.forEach(el => {
        if (el.name == this.yearModelFact) {
          res.push(el);
        }
      })
      let counter = 0;
      res[0].data.forEach(el => {
        counter += el;

      })
      this.getCountOfFactYearWatch = counter;
      return res;
    },
    /***************************************************
         *                      События
         ***************************************************/

    /**
           * Получение списка все школ
           *
           */
    async getEvent() {
      try {
        const res = await api.get("api/event", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        let sch = res.data;

        sch.forEach(sch => {
          let likeCount = 0;
          sch['viewCount'] = 0;
          if (sch.views == null) {
            sch.views = [];
          }
          else {
            let views = [];

            Object.values(sch.views).forEach(view => {
              views.push(view.views[0]);
              if (view.like)
                likeCount++;
            })
            sch.views = views;
            sch['viewCount'] = views.length;
          }
        });

        this.events = sch;
        this.allYearsEventData = this.getEventInPeriodDiagramm();
        this.currentPeriodEventData = this.setEventsCurrent();
        this.eventOptions.series = this.currentPeriodEventData;
      } catch (error) {
        this.onError(error);
      }
    },

    getEventInPeriodDiagramm() {
      let currentYear = new Date().getFullYear().toString();
      let startYear = Number(this.startYear) - 1;
      let endYear = Number(currentYear) + 1;
      let start = startYear + '-12-31';
      let end = endYear + '-01-01';
      let startDate = new Date(start);
      let endDate = new Date(end);

      let eventParams = [];
      let yearArray = [];
      for (let year = this.startYear; year <= currentYear; year++) {
        yearArray.push(year.toString());
        eventParams.push({ year: year.toString(), values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
      }



      this.events.forEach(sc => {
        sc.views.forEach(viw => {
          let viewDate = new Date(viw);
          if (viewDate > startDate && viewDate < endDate) {
            let dateSplits = viw.split('-');
            let index = yearArray.indexOf(dateSplits[0].toString());
            if (index != -1) {
              eventParams[index].values[Number(dateSplits[1]) - 1]++;
            }
          }
        })
      })



      let data = [];
      eventParams.forEach(element => {
        data.push(
          {
            name: element.year,
            data: element.values,
            type: "bar",
            smooth: true,
          });
      });

      return data;
    },


    setEventsCurrent() {
      let res = [];
      this.allYearsEventData.forEach(el => {
        if (el.name == this.yearModelEvent) {
          res.push(el);
        }
      })
      let counter = 0;
      res[0].data.forEach(el => {
        counter += el;
      })
      this.getCountOfEventYearWatch = counter;
      return res;
    },





    /**
     * Обработка ошибок при работе с API
     * @param {*} error
     */
    onError(error) {
      this.loaded = true;
      if (!error.response || !error.response.status) {
        this.$q.notify({
          type: "negative",
          message: "Нет соединения с сервером",
        });
        return;
      }
      this.error = error.response.status;
      if (this.error != 403) {
        this.$q.notify({
          type: "negative",
          message: error.response.data.message ?? "Ошибка сервера",
        });
      }
    },
    //Измекнение данных таблицы просмотров
    changeDownloadData() {
      //Обновление кругововй диаграммы

      this.getUsers();
      this.getDownload();
      this.schoolOptions.series = [];
    },

    changeSchoolData() {

      this.currentPeriodSchoolData = this.setSchoolsCurrent();
      this.schoolOptions.series = this.currentPeriodSchoolData;
    },
    changeFectData() {

      this.currentPeriodFactData = this.setFactsCurrent();
      this.factOptions.series = this.currentPeriodFactData;

    },
    changeEventData() {

      this.currentPeriodEventData = this.setEventsCurrent();
      this.eventOptions.series = this.currentPeriodEventData;
    },

    SaveImage(type) {
      const linkSource = this.$refs[type].getDataURL();
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = '_self';
      downloadLink.download = type + '.png';
      downloadLink.click();
    },
  },
};
</script>
<style scoped>
.chart {
  height: 350px;
}

.block {
  margin-bottom: 24px;
}

.inline {
  display: inline-block;
}

.image-center {
  width: 20vh;
  height: 20vh;
}
</style>

