<template>
  <div class="row">
     <div class="row ml-2">
      <div class="col-md-6">
        <h3 class="font-weight-bold section-name">Quản trị hệ thống</h3>
      </div>
      <div class="col-md-6">
        <div
              class="btn-group btn-group-toggle float-right"
              data-toggle="buttons"
            >
              <label
                v-for="(option, index) in adminstrationOption"
                :key="option"
                class="btn btn-sm btn-neutral btn-gay"
                :class="{ active: bigLineChart.activeIndex === index }"
                :id="index"
              >
                <input
                  type="radio"
                  @click="initBigChart(index)"
                  name="options"
                  autocomplete="off"
                  :checked="bigLineChart.activeIndex === index"
                />
                {{ option }}
              </label>
            </div>
      </div>
    </div>
          
    <div class="col-md-12" v-if="bigLineChart.activeIndex === 0">
      <account-setting> </account-setting>
    </div>
    <div class="col-md-12" v-if="bigLineChart.activeIndex === 1">
      <user-setting ></user-setting>
    </div>
    <div class="col-md-12" v-if="bigLineChart.activeIndex === 2">
      <curriculum ></curriculum>
    </div>
  </div>
</template>

<script>
import AccountSetting from './Administration/AccountSetting.vue'
import UserSetting from './Administration/UserSetting.vue'

import config from "@/config";


export default {
  components: { 
    AccountSetting,
    UserSetting,
    Curriculum
  },
  computed: {
    adminstrationOption() {
      return this.$t("dashboard.administration");
    },
  },
  data() {
    return {
      bigLineChart: {
        activeIndex: 0,
        index: "Quản trị",
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: [],
      },
    }
  },
  methods: {
    initBigChart(index) {
      let chartData = {
        datasets: [
          {
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
          },
        ],
        labels: [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ],
      };

      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = index;
    },
  }

}
</script>

<style>

</style>