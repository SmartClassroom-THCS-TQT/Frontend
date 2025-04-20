<template>
  <div class="row">
    <!-- Initial view: Class Selection -->
    <div class="col-12" v-if="!selectedRoom">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-md-6">
              <h3 class="font-weight-bold">Học kỳ {{ currentSemester ? currentSemester.semester : "Đang tải..." }}</h3>
            </div>
            <div class="col-md-6 text-right">
              <span v-if="currentSemester">Tuần {{ currentSemester.current_week }}</span>
            </div>
          </div>
        </template>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="text-center p-5">
          <i class="tim-icons icon-refresh-01 fa-spin" style="font-size: 2rem;"></i>
          <p class="mt-3">Đang tải dữ liệu...</p>
        </div>
        
        <!-- No classes assigned message -->
        <div v-else-if="roomOption.length === 0" class="text-center p-5">
          <i class="tim-icons icon-alert-circle-exc" style="font-size: 2rem;"></i>
          <p class="mt-3">Giáo viên chưa được phân công lớp dạy</p>
        </div>
        
        <!-- Class selection cards -->
        <div v-else class="row p-3">
          <div class="col-12 mb-4">
            <h4>Vui lòng chọn lớp để tiếp tục</h4>
          </div>
          
          <div v-for="(room, index) in roomOption" :key="index" class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card class-card shadow h-100" @click="selectRoom(room)">
              <div class="card-body text-center">
                <h4 class="card-title font-weight-bold text-dark">{{ room ? room.name : "" }}</h4>
                <p class="text-muted">{{ subjectInfo }}</p>
              </div>
              <div class="card-footer bg-transparent">
                <base-button class="btn-block" type="success" @click.stop="selectRoom(room)">
                  Chọn lớp
                </base-button>
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>
    
    <!-- After class selection: Main functionality -->
    <div v-else class="col-12">
      <div class="row mb-4">
        <div class="col-md-6">
          <h3 class="font-weight-bold section-name">
            Lớp {{ selectedRoom.name }} - Học kỳ {{ currentSemester ? currentSemester.semester : "" }}
          </h3>
        </div>
        <div class="col-md-6">
          <div class="btn-group btn-group-toggle float-right">
            <base-button type="info" size="sm" class="mr-2" @click="backToClassSelection">
              <i class="tim-icons icon-minimal-left"></i> Chọn lớp khác
            </base-button>
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
        <score-statistic :room-code="selectedRoom" :semester="currentSemester"></score-statistic>
      </div>
      <div class="col-md-12" v-if="bigLineChart.activeIndex === 1">
        <score-detail :room-code="selectedRoom" :semester="currentSemester"></score-detail>
      </div>
      <div class="col-md-12" v-if="bigLineChart.activeIndex === 2">
        
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import ScoreDetail from './LearningManagement/ScoreDetail.vue';
import ScoreStatistic from './LearningManagement/ScoreStatistic.vue';
import Card from "../components/Cards/Card.vue";
import axios from "../services/axios";

export default {
  components: { 
    ScoreDetail,
    ScoreStatistic,
    Card
  },
  computed: {
    adminstrationOption() {
      return this.$t("dashboard.learningManagement");
    },
    subjectInfo() {
      return this.subject ? `Môn: ${this.subject}` : '';
    }
  },
  data() {
    return {
      isLoading: true,
      selectedRoom: null,
      roomOption: [],
      currentSemester: null,
      userData: null,
      divisionData: null,
      subject: null,
      apiUrl: "",
      
      bigLineChart: {
        activeIndex: 0,
        index: "Quản trị",
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: [],
      },
    }
  },
  mounted() {
    this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        this.isLoading = true;
        this.apiUrl = this.$t("dashboard.apiURL");
        await this.getUserData();
        await this.getCurrentSemester();
        await this.getRoomOption();
        this.isLoading = false;
      } catch (error) {
        console.error('Error initializing data:', error);
        this.isLoading = false;
      }
    },
    selectRoom(room) {
      this.selectedRoom = room;
      // Reset to first tab when changing rooms
      this.bigLineChart.activeIndex = 0;
    },
    backToClassSelection() {
      this.selectedRoom = null;
    },
    getUserData(){
      this.userData = JSON.parse(localStorage.getItem('user_data'));
    },
    getCurrentSemester() {
      const token = localStorage.getItem("access_token");
      
      return new Promise((resolve, reject) => {
        axios
          .get(this.apiUrl + "/managements/check-semester/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.currentSemester = response.data;
            resolve();
          })
          .catch((error) => {
            console.error("Error getting current semester:", error);
            reject(error);
          });
      });
    },
    getRoomOption(){
      const token = localStorage.getItem("access_token");

      return new Promise((resolve, reject) => {
        axios
          .get(this.apiUrl + `/managements/teacher-assignments/?teacher__account=${this.userData.account}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if(response.data.length === 0){
              this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Giáo viên chưa được phân công lớp dạy",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
              this.isLoading = false;
              resolve();
              return;
            }
            this.divisionData = response.data;
            console.log(this.divisionData);
            this.roomOption = this.divisionData.map(item => item.room_id);
            this.subject = this.divisionData[0].subject;
            resolve();
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
            reject(error);
          });
      });
    },
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
.class-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-footer {
  border-top: none;
}
</style>