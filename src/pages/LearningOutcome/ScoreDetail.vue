<template>
  <div class="row">
    <div class="col-12">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-md-5">
              <h3>Bảng điểm</h3>
            </div>
            <div class="col-md-7">
              <div class="row">
                <div class="col-md-3 pr-md-1 text-center">
                  <base-input label="Học kỳ">
                    <select class="btn btn-simple btn-sm btn-info" v-model="semesterSelected">
                      <option class="text-info" v-for="(semester, index) in semesters" :key="index" :value="semester">{{ semester.name }}</option>
                    </select>
                  </base-input>
                </div>
                <!-- <div class="col-md-3 pr-md-1 text-center">
                  <base-input label="Loại điểm">
                    <select class="btn btn-simple btn-sm btn-success" v-model="scoreTypeSelected">
                      <option class="text-info" v-for="scoreType in scoreTypes" :key="scoreType" :value="scoreType" >{{ scoreType }}</option>
                    </select>
                  </base-input>
                </div> -->
                <div class="col-md-3 pl-md-1 text-center">
                  <base-button 
                    class="btn btn-sm "
                    @click="getScoreData"
                    fill
                  >Lọc
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Bảng điểm -->
        <div>
          <base-table :data="scoreData" :columns="score_columns">
            <template slot="columns">
              <th>Môn</th>
              <th class="text-center">Thường xuyên</th>
              <th class="text-center">Giữa kỳ</th>
              <th class="text-center">Cuối kỳ</th>
            </template>
            <template slot-scope="{ row }">
              <td> <div class="text-info"> {{ row.subject }}</div></td>

              <td class="text-center">{{ row.tx.join(" | ") }}</td>
              <td class="text-center">{{ row.gk.join(" ") }}</td>
              <td class="text-center">{{ row.ck.join(" ") }}</td>
            </template>
          </base-table>
        </div>
        
      </card>

      <!-- Danh sách ngày nghỉ học -->
      <card class="mt-4">
        <template slot="header">
          <div class="row">
            <div class="col-md-12">
              <h3>Danh sách ngày nghỉ học</h3>
            </div>
          </div>
        </template>

        <!-- Bảng danh sách ngày nghỉ -->
        <div>
          <base-table :data="absenceData" :columns="absence_columns">
            <template slot="columns">
              <th>Ngày</th>
              <th>Thứ</th>
              <th>Các tiết nghỉ</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.date }}</td>
              <td>{{ row.day_of_week }}</td>
              <td>{{ row.periods.join(", ") }}</td>
            </template>
          </base-table>
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
let API_URL = "";

export default {
    components: { Card, BaseTable, Modal, BarChart },
    mounted() {
      this.initializeData();
    },
    data() {
        return {
          scoreData: this.initializeScoreData(), // Dữ liệu điểm đã được định dạng
          score_columns: ['Môn', 'Thường xuyên', 'Giữa kỳ', 'Cuối kỳ'], // Cột của bảng
          absence_columns: ['Ngày', 'Thứ', 'Các tiết nghỉ'], // Cột của bảng nghỉ học

          roomSelected: null,
          semesterSelected: null,
          scoreTypeSelected: null,
          currentSemester: null,

          scoreData: null,
          absenceData: [],
          userData: null,
          roomOption: null,
          semesters: null,
          scoreTypes: ["TX", "GK", "CK"],
          subject: null,
        };
    },
    methods: {
      initializeScoreData() {
        const subjects= ['TOAN', 'VAN', 'ANH', 'KHTN_HOA', 'KHTN_LY', 'KHTN_SINH', 'KHXH_DIA', 'KHXH_SU', 'KHXH_GDCD', 'TD', 'MT', 'AN', 'TH', 'CN', 'HDTN-HN'];
        return Array.from({ length: 15 }, (_, index) => ({
          subject: subjects[index],
          tx: [],
          gk: [],
          ck: [],
        }));
      },
      async initializeData() {
        try {
          await this.getApiUrl();
          await this.getUserData();
          await this.getCurrentSemester();
          // await this.getSemesterData();
          await this.getAbsenceData();
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      },
      getUserData(){
        this.userData = JSON.parse(localStorage.getItem('user_data'));
        this.subject = this.userData.subject
      },
      getApiUrl() {
        return new Promise((resolve) => {
          API_URL = this.$t("dashboard.apiURL");
          resolve();
        });
      },
      getCurrentSemester() {
        const token = localStorage.getItem("access_token");
        
        return new Promise((resolve, reject) => {
          axios
            .get(API_URL + "/managements/check-semester/", {
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
              console.error("Error getting current semester data:", error);
              this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Lấy dữ liệu học kỳ hiện tại thất bại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
              reject(error);
            });
        });
      },
      getSemesterData() {
        const token = localStorage.getItem("access_token");

        return new Promise((resolve, reject) => {
          axios
            .get(API_URL + "/adminpanel/semesters/", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              this.semesters = response.data;
              
              // Tự động chọn học kỳ hiện tại
              if (this.currentSemester && this.semesters && this.semesters.length > 0) {
                const currentSemValue = this.currentSemester.semester;
                const foundSemester = this.semesters.find(sem => sem.value === currentSemValue);
                
                if (foundSemester) {
                  this.semesterSelected = foundSemester;
                  // Tự động lấy điểm cho học kỳ hiện tại
                  this.getScoreData();
                } else {
                  // Nếu không tìm thấy, chọn học kỳ đầu tiên
                  this.semesterSelected = this.semesters[0];
                }
              }
              
              resolve();
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
              reject(error);
            });
        });
      },
      getScoreData(){
        const token = localStorage.getItem("access_token");
        this.scoreData = this.initializeScoreData();

        if (!this.semesterSelected || !this.userData) {
          this.$notify({
            type: "warning",
            icon: 'tim-icons icon-bell-55',
            message: "Vui lòng chọn học kỳ trước khi lọc dữ liệu",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
          return;
        }

        axios
          .get(API_URL + `/adminpanel/grades?student=${this.userData.user_id}&semester_name=${this.semesterSelected.name}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.$notify({
              type: "success",
              icon: 'tim-icons icon-bell-55',
              message: "Lấy bảng điểm thành công",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
            this.scoreData = this.formatScoreData(response.data);
          })
          .catch((error) => {
            console.error("Error getting score data:", error);
            this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Lấy danh sách điểm thất bại",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          });
      },
      getAbsenceData() {
        const token = localStorage.getItem("access_token");
        
        if (!this.userData) {
          console.error("User data not available");
          return;
        }
        
        axios
          .get(API_URL + `/rooms_managements/attendances/?student=${this.userData.account}&status=false`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("response", response.data);
            // Log the first item's session structure to check time_slot format
            if (response.data.length > 0) {
              console.log("Example session:", response.data[0].session);
            }
            this.absenceData = this.formatAbsenceData(response.data);
            console.log("absenceData", this.absenceData);
          })
          .catch((error) => {
            console.error("Error getting absence data:", error);
            this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Lấy dữ liệu nghỉ học thất bại",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          });
      },
      formatAbsenceData(data) {
        // Nhóm dữ liệu điểm danh theo ngày
        const groupedByDate = {};
        
        data.forEach(item => {
          // Lấy thông tin từ session của mỗi bản ghi
          const date = item.session.day;
          const timeSlot = item.session.time_slot;
          
          if (!groupedByDate[date]) {
            // Xác định thứ trong tuần
            const dayOfWeek = this.getDayOfWeek(new Date(date));
            
            groupedByDate[date] = {
              date: this.formatDate(date),
              day_of_week: dayOfWeek,
              periods: []
            };
          }
          
          // Thêm tiết học vào danh sách các tiết nghỉ của ngày đó
          if (timeSlot && !groupedByDate[date].periods.includes(timeSlot)) {
            groupedByDate[date].periods.push(timeSlot);
          }
        });
        
        // Sắp xếp tiết học và chuyển đối tượng thành mảng
        Object.values(groupedByDate).forEach(day => {
          day.periods.sort((a, b) => a - b);
        });
        
        // Sắp xếp theo ngày mới nhất trước
        return Object.values(groupedByDate).sort((a, b) => {
          // Sắp xếp ngày theo thứ tự giảm dần (mới nhất trước)
          return new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'));
        });
      },
      getDayOfWeek(date) {
        const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
        return days[date.getDay()];
      },
      formatDate(dateString) {
        // Ensure dateString is in a format that can be parsed by new Date()
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      formatScoreData(data) {
          const groupedScores = {};

          // Khởi tạo với tất cả các môn để đảm bảo mỗi môn đều có một dòng trong bảng
          this.initializeScoreData().forEach(subjectEntry => {
            groupedScores[subjectEntry.subject] = {
              subject: subjectEntry.subject,
              tx: [],
              gk: [],
              ck: []
            };
          });

          // Cập nhật dữ liệu điểm thực tế từ API
          data.forEach(item => {
            if (groupedScores[item.subject]) {
              // Thêm điểm vào đúng loại (TX, GK, CK)
              if (item.score_type === "TX") {
                groupedScores[item.subject].tx = item.grade;
              } else if (item.score_type === "GK") {
                groupedScores[item.subject].gk = item.grade;
              } else if (item.score_type === "CK") {
                groupedScores[item.subject].ck = item.grade;
              }
            }
          });

          // Chuyển đổi đối tượng groupedScores thành mảng để dễ hiển thị trong bảng
          return Object.values(groupedScores);
      },
    },
};
</script>

<style>

</style>
