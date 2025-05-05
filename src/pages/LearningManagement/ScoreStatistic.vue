<template>
  <div class="row">
    <div class="col-12">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-md-5">
              <h3>Thống kê điểm {{ roomSelected ? " Lớp "+ roomSelected : "" }} </h3>
            </div>
            <div class="col-md-7">
              <div class="row">
                <div class="col-md-12 text-right">
                  <base-button 
                    class="btn btn-sm"
                    @click="getChartData"
                    fill
                  >
                    <i class="tim-icons icon-refresh-01 mr-1"></i>
                    Làm mới
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div>
          <bar-chart style="height: 100%"
                    ref="bigChart"
                    :chart-data="blueBarChart.chartData"
                    :gradient-color="blueBarChart.gradientColors"
                    :gradient-stops="blueBarChart.gradientStops"
                    :extra-options="blueBarChart.extraOptions">
          </bar-chart>
        </div>
        
      </card>

    </div>
  </div>
</template>

<script>
import Card from "../../components/Cards/Card.vue";
import BaseTable from '../../components/BaseTable.vue';
import axios from "../../services/axios";
import Modal from '../../components/Modal.vue';
import BarChart from "@/components/Charts/BarChart";
import config from "@/config";
let API_URL = "";

export default {
    components: { Card, BaseTable, Modal, BarChart },
    mounted() {
      this.initializeData();
    },
    data() {
        return {
          roomSelected: null,
          semesterSelected: null,
          scoreTypeSelected: null,

          scoreStatistic: null,

          divisionData: null,
          userData: null,
          roomOption: [],
          semesters: null,
          scoreTypes: ["TX", "GK", "CK"],
          subject: "VAN",
          
          
          blueBarChart: {
            extraOptions: {
              maintainAspectRatio: false,
              legend: {
                display: false
              },
              responsive: true,
              tooltips: {
                backgroundColor: '#f5f5f5',
                titleFontColor: '#333',
                bodyFontColor: '#666',
                bodySpacing: 4,
                xPadding: 12,
                mode: "nearest",
                intersect: 0,
                position: "nearest"
              },
              scales: {
                yAxes: [{
            
                  gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: "transparent",
                  },
                  ticks: {
                    suggestedMin: 0,
                    suggestedMax: 9,
                    padding: 2,
                    fontColor: "#9e9e9e"
                  }
                }],
                xAxes: [{
            
                  gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: "transparent",
                  },
                  ticks: {
                    padding: 20,
                    fontColor: "#9e9e9e"
                  }
                }]
              }
            },
            chartData: {
              labels: ["0-0.5", "0.5-1", "1-1.5", "1.5-2", "2-2.5", "2.5-3", "3-3.5", "3.5-4", "4-4.5", "4.5-5", "5-5.5", "5.5-6", "6-6.5", "6.5-7", "7-7.5", "7.5-8", "8-8.5", "8.5-9", "9-9.5", "9.5-10"],
              datasets: [{
                label: "Số lượng",
                fill: true,
                borderColor: '#1f8ef1',
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
                
              }]
            },
            gradientColors: ['rgba(29,140,248,0.2)', 'rgba(29,140,248,0.0)', 'rgba(29,140,248,0)'],
            gradientStops: [1, 0.4, 0],
          },
        };
    },
    props: {
      roomCode: {
        type: Object, 
        required: true,
        default: () => ({}),
      },
      semester: {
        type: Object, 
        required: true,
        default: () => ({}),
      }
    },
    methods: {
      async initializeData() {
        try {
          await this.getApiUrl();
          await this.getUserData();
          await this.getChartData();
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      },
      
      getChartData(){
        const token = localStorage.getItem("access_token");

        axios
          .get(API_URL + `/academic_results/grades_distribution/?semester=${this.semester.semester}&subject_code=${this.roomCode.subject_code.code}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            // let color = null;
            // if (this.semesterSelected.name == "20241") {
            //   color = config.colors.primary
            // }
            // if (this.semesterSelected.name == "20242") {
            //   color = config.colors.info
            // }
            let chartData = {
              datasets: [{
                label: "Số lượng",
                fill: true,
                borderColor: '#1f8ef1',
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                data: Object.values(response.data.map(item => item.count)),      
                  
                
              }],
              labels: ["0-0.5", "0.5-1", "1-1.5", "1.5-2", "2-2.5", "2.5-3", "3-3.5", "3.5-4", "4-4.5", "4.5-5", "5-5.5", "5.5-6", "6-6.5", "6.5-7", "7-7.5", "7.5-8", "8-8.5", "8.5-9", "9-9.5", "9.5-10"],
            };
            this.$refs.bigChart.updateGradients(chartData);
            this.blueBarChart.chartData = chartData;
            this.$notify({
              type: "success",
              icon: 'tim-icons icon-bell-55',
              message: "Lọc thành công thống kê điểm",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          })
          .catch((error) => {
            console.error("Error getting statistic:", error);
            this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Lấy dữ liệu thống kê thất bại",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          });
      },
      getUserData(){
        this.userData = JSON.parse(localStorage.getItem('user_data'));
      },
      getApiUrl() {
        return new Promise((resolve) => {
          API_URL = this.$t("dashboard.apiURL");
          resolve();
        });
      },
      getRoomOption(){
        const token = localStorage.getItem("access_token");

        axios
          // .get(API_URL + `/adminpanel/assignments/${this.userData.user_id}`, {
             .get(API_URL + `/adminpanel/assignments/?user_id=${this.userData.user_id}`, {
          
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if(response.data.length == 0){
              this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Giáo viên chưa được phân công lớp dạy",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
            return
            }
            this.divisionData = response.data
            // các thành phần con của divisionData là 1 object và có 1 trường room
            //lấy ra các room trong các thành phần con đó cho vào roomOption (arr)
            this.roomOption = this.divisionData.map(item => item.room);
            this.subject = this.divisionData[0].subject
            
          })
          .catch((error) => {
            console.error("Error getting room data:", error);
            this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Lấy danh sách lớp học thất bại",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          });
      },
      
      getSemesterData() {
        if (this.semesters) return;
        const token = localStorage.getItem("access_token");

        axios
          .get(API_URL + "/adminpanel/semesters/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.semesters = response.data;
          })
          .catch((error) => {
            console.error("Error getting semester data:", error);
            this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Lấy dữ liệu học kỳ thất bại",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          });
      },
    },
};
</script>

<style>

</style>
