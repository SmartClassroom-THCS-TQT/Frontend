<template>
  <div class="row">
    <div class="col-12">
      <!-- Bảng điểm -->
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-md-4">
              <h3>Bảng điểm</h3>
            </div>
            <div class="col-md-8">
              <div class="row">
                <div class="col-md-4 pr-md-1 text-center">
                  <base-input label="Học kỳ">
                    <select class="btn btn-simple btn-sm btn-info" v-model="selectedSemester" @change="getStudentGrades">
                      <option class="text-info" v-for="semester in semesters" :key="semester.code" :value="semester.code">
                        {{ formatSemesterName(semester.code) }}
                      </option>
                    </select>
                  </base-input>
                </div>
                <div class="col-md-4 pr-md-1 text-center">
                  <base-input label="Môn học">
                    <select class="btn btn-simple btn-sm btn-info" v-model="selectedSubject" @change="getStudentGrades">
                      <option class="text-info" value="all">Tất cả các môn</option>
                      <option class="text-info" v-for="subject in subjects" :key="subject.code" :value="subject.code">
                        {{ subject.name }}
                      </option>
                    </select>
                  </base-input>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Bảng điểm -->
        <div v-if="gradesLoading" class="text-center py-4">
          <i class="fa fa-spinner fa-spin fa-2x"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="formattedGrades.length === 0" class="text-center py-4">
          <p>Không có dữ liệu điểm trong học kỳ này.</p>
        </div>
        <div v-else>
          <base-table :data="formattedGrades" :columns="grade_columns">
            <template slot="columns">
              <th>Môn học</th>
              <th class="text-center">Loại điểm</th>
              <th class="text-center">Điểm</th>
              <th class="text-center">Ngày nhập</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ getSubjectName(row.subject) }}</td>
              <td class="text-center">{{ getGradeTypeName(row.grade_type) }}</td>
              <td class="text-center">{{ row.score }}</td>
              <td class="text-center">{{ formatDate(row.date_assigned) }}</td>
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
        <div v-if="absenceLoading" class="text-center py-4">
          <i class="fa fa-spinner fa-spin fa-2x"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="absenceData.length === 0" class="text-center py-4">
          <p>Không có dữ liệu nghỉ học.</p>
        </div>
        <div v-else>
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

export default {
  components: { Card, BaseTable },
  data() {
    return {
      // Thông tin học kỳ
      currentSemester: null,
      selectedSemester: null,
      semesters: [],

      // Thông tin môn học
      subjects: [],
      selectedSubject: 'all',

      // Dữ liệu điểm
      gradesData: [],
      grade_columns: ['Môn học', 'Loại điểm', 'Điểm', 'Ngày nhập'],
      gradesLoading: false,

      // Dữ liệu nghỉ học
      absenceData: [],
      absence_columns: ['Ngày', 'Thứ', 'Các tiết nghỉ'],
      absenceLoading: false,

      // Thông tin người dùng
      userData: null,
      
      // API URL
      API_URL: ""
    };
  },
  computed: {
    formattedGrades() {
      if (!this.gradesData) return [];
      
      // Nếu đã chọn môn học cụ thể
      if (this.selectedSubject !== 'all') {
        return this.gradesData.filter(grade => grade.subject === parseInt(this.selectedSubject));
      }
      
      return this.gradesData;
    }
  },
  async mounted() {
    await this.initializeData();
  },
  methods: {
    async initializeData() {
      try {
        this.getApiUrl();
        await this.getUserData();
        await this.getCurrentSemester();
        await this.getSemesters();
        await this.getSubjects();
        
        // Sau khi có dữ liệu cơ bản, lấy điểm và dữ liệu nghỉ học
        await Promise.all([
          this.getStudentGrades(),
          this.getAbsenceData()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        this.showNotification('warning', 'Có lỗi khi khởi tạo dữ liệu');
      }
    },
    
    getApiUrl() {
      this.API_URL = this.$t("dashboard.apiURL");
    },
    
    getUserData() {
      this.userData = JSON.parse(localStorage.getItem('user_data'));
      if (!this.userData) {
        this.showNotification('warning', 'Không tìm thấy thông tin người dùng');
        return Promise.reject('No user data found');
      }
      return Promise.resolve();
    },
    
    async getCurrentSemester() {
      this.gradesLoading = true;
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${this.API_URL}/managements/check-semester/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        
        this.currentSemester = response.data;
        this.selectedSemester = this.currentSemester.semester;
        return response.data;
      } catch (error) {
        console.error("Error getting current semester:", error);
        this.showNotification('warning', 'Lấy dữ liệu học kỳ hiện tại thất bại');
        throw error;
      } finally {
        this.gradesLoading = false;
      }
    },
    
    async getSemesters() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${this.API_URL}/managements/semesters/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        
        this.semesters = response.data;
        return response.data;
      } catch (error) {
        console.error("Error getting semesters:", error);
        this.showNotification('warning', 'Lấy danh sách học kỳ thất bại');
        throw error;
      }
    },
    
    async getSubjects() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${this.API_URL}/managements/subjects/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        
        this.subjects = response.data;
        return response.data;
      } catch (error) {
        console.error("Error getting subjects:", error);
        this.showNotification('warning', 'Lấy danh sách môn học thất bại');
        throw error;
      }
    },
    
    async getStudentGrades() {
      if (!this.selectedSemester || !this.userData) {
        this.showNotification('warning', 'Vui lòng chọn học kỳ trước khi lọc dữ liệu');
        return;
      }
      
      this.gradesLoading = true;
      try {
        const token = localStorage.getItem("access_token");
        let url = `${this.API_URL}/academic_results/grades/?student_id=${this.userData.account}&semester=${this.selectedSemester}`;
        
        if (this.selectedSubject !== 'all') {
          url += `&subject_code=${this.selectedSubject}`;
        }
        
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        
        this.gradesData = response.data;
        this.showNotification('success', 'Lấy bảng điểm thành công');
      } catch (error) {
        console.error("Error getting student grades:", error);
        this.showNotification('warning', 'Lấy danh sách điểm thất bại');
      } finally {
        this.gradesLoading = false;
      }
    },
    
    async getAbsenceData() {
      if (!this.userData) {
        console.error("User data not available");
        return;
      }
      
      this.absenceLoading = true;
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${this.API_URL}/rooms_managements/attendances/?student=${this.userData.account}&status=false`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        
        this.absenceData = this.formatAbsenceData(response.data);
      } catch (error) {
        console.error("Error getting absence data:", error);
        this.showNotification('warning', 'Lấy dữ liệu nghỉ học thất bại');
      } finally {
        this.absenceLoading = false;
      }
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
        return new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'));
      });
    },
    
    // Các hàm hỗ trợ
    getDayOfWeek(date) {
      const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
      return days[date.getDay()];
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    
    formatSemesterName(code) {
      // Ví dụ: 20251 -> "Học kỳ 1 năm 2025-2026"
      const year = Math.floor(code / 10);
      const semester = code % 10;
      return `Học kỳ ${semester} năm ${year}`;
    },
    
    getSubjectName(subjectCode) {
      const subject = this.subjects.find(s => s.code === subjectCode);
      return subject ? subject.name : `Môn học ${subjectCode}`;
    },
    
    getGradeTypeName(typeCode) {
      const gradeTypes = {
        1: "Kiểm tra thường xuyên",
        2: "Kiểm tra thường xuyên",
        3: "Kiểm tra thường xuyên"
      };
      return gradeTypes[typeCode] || "Kiểm tra thường xuyên";
    },
    
    showNotification(type, message) {
      this.$notify({
        type: type,
        icon: 'tim-icons icon-bell-55',
        message: message,
        timeout: 3000,
        verticalAlign: "top",
        horizontalAlign: "right",
      });
    }
  }
};
</script>

<style>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>