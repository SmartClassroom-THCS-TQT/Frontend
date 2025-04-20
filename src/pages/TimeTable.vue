<template>
  <div class="card-container">
    <div class="timetable-title">
      <h2>Thời khóa biểu {{ userRole === 'teacher' ? 'giáo viên' : 'học sinh' }}</h2>
      <p v-if="userData">{{ userRole === 'teacher' ? 'Giáo viên: ' : 'Học sinh: ' }}{{ userData.full_name }}</p>
    </div>
    <div class="row custom-time-table">
      <div class="calendar-container">
        <!-- Phần lịch -->
        <div class="calendar-section">
          <div class="calendar-header">
            <button class="nav-button" @click="previousMonth">&lt;</button>
            <span class="month-title">{{ currentMonthName }} {{ currentYear }}</span>
            <button class="nav-button" @click="nextMonth">&gt;</button>
          </div>
          <div class="calendar-grid">
            <div class="calendar-day header" v-for="day in daysOfWeek" :key="day">
              {{ day }}
            </div>
            <div
              v-for="day in calendarDays"
              :key="formatDate(day.date)"
              :class="[
                'calendar-day',
                { 
                  'current-day': day.isToday, 
                  'other-month': day.isOtherMonth, 
                  'has-lesson': day.hasLesson,
                  'selected-day': formatDate(day.date) === selectedDay
                }
              ]"
              @click="selectDay(formatDate(day.date))"
            >
              <span class="day-number">{{ day.date.getDate() }}</span>
              <div class="day-indicator">
                <span v-if="day.hasLesson" class="lesson-dot"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Phần danh sách tiết học -->
        <div class="lesson-list">
          <div class="lesson-header">
            <h3 v-if="selectedDay">Tiết học ngày {{ formatDisplayDate(selectedDay) }}</h3>
            <h3 v-else>Danh sách tiết học</h3>
          </div>
          <div class="lesson-content">
            <ul v-if="selectedDayLessons.length">
              <li v-for="lesson in selectedDayLessons" :key="lesson.id" @click="toggleSessionDetail(lesson.id)">
                <div class="lesson-time">Tiết {{ lesson.time_slot.code }}</div>
                <div class="lesson-info">
                  <div class="lesson-subject">Môn học: {{ lesson.subject_code.name }}</div>
                  <div class="lesson-room">Phòng: {{ lesson.room_id.name }}</div>
                  <div v-if="userRole === 'student'" class="lesson-teacher">Giáo viên: {{ lesson.teacher.full_name }}</div>
                </div>
              </li>
            </ul>
            <div class="empty-state" v-if="(!selectedDayLessons.length) && selectedDay">
              <i class="fas fa-calendar-times"></i>
              <p>Không có tiết học nào.</p>
            </div>
            <div class="empty-state" v-if="(!selectedDayLessons.length) && !selectedDay">
              <i class="tim-icons icon-calendar-60"></i>
              <p>Chọn một ngày để xem tiết học.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

let API_URL;

export default {
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYearValue: new Date().getFullYear(),
      lessons: [],
      selectedDay: null,
      selectedDayLessons: [],
      userData: null,
      userRole: localStorage.getItem('user_role') || 'student' // Mặc định là student nếu không có
    };
  },
  computed: {
    currentYear() {
      return this.currentYearValue;
    },
    currentMonthName() {
      const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
      return monthNames[this.currentMonth];
    },
    daysOfWeek() {
      return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      const days = [];
      
      // Add days from previous month to fill the first week
      const firstDayOfWeek = firstDay.getDay();
      const prevMonth = new Date(this.currentYear, this.currentMonth, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthDays - i);
        const formattedDate = this.formatDate(date);
        
        days.push({
          date,
          isToday: this.formatDate(new Date()) === formattedDate,
          isOtherMonth: true,
          hasLesson: this.lessons.some((lesson) => lesson.day === formattedDate),
          events: []
        });
      }
      
      // Add days for current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        const formattedDate = this.formatDate(date);
        
        days.push({
          date,
          isToday: this.formatDate(new Date()) === formattedDate,
          isOtherMonth: false,
          hasLesson: this.lessons.some((lesson) => lesson.day === formattedDate),
          events: []
        });
      }
      
      // Add days from next month to fill the last week
      const lastDayOfWeek = lastDay.getDay();
      const daysToAdd = 6 - lastDayOfWeek;
      
      for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        const formattedDate = this.formatDate(date);
        
        days.push({
          date,
          isToday: this.formatDate(new Date()) === formattedDate,
          isOtherMonth: true,
          hasLesson: this.lessons.some((lesson) => lesson.day === formattedDate),
          events: []
        });
      }
      
      return days;
    }
  },
  mounted() {
    this.getUserData();
    this.initData();
  },
  methods: {
    initData() {
      this.getApiUrl();
    },
    getApiUrl() {
      API_URL = this.$t("dashboard.apiURL");
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatDisplayDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
    selectDay(date) {
      this.selectedDay = date;
      this.selectedDayLessons = this.lessons.filter((lesson) => lesson.day === date);
    },
    previousMonth() {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYearValue--;
      }
    },
    nextMonth() {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYearValue++;
      }
    },
    getUserData(){
      this.userData = JSON.parse(localStorage.getItem('user_data'));
      if (!this.userData) {
        console.log('User data not available yet, will try again shortly');
        // Retry after a short delay if userData is not available
        setTimeout(() => this.getUserData(), 500);
        return;
      }
      console.log(this.userData.account);
      this.getSessions();
    },
    getSessions() {
      if (!this.userData || !this.userData.account) {
        console.log('Cannot get sessions because userData is not fully loaded');
        return;
      }
      
      const token = localStorage.getItem("access_token");
      // Check user role and get the appropriate ID
      const userId = this.userData.account;
      
      // Set query parameter based on user role
      let queryParam = '';
      if (this.userRole === 'teacher') {
        queryParam = `?teacher=${userId}`;
      } else {
        // Assume role is student, get sessions for student's class/room
        if (!this.userData.rooms || !this.userData.rooms.length) {
          console.log('No rooms available for student');
          return;
        }
        const roomId = this.userData.rooms[0]; // Giả sử student data có room_code
        queryParam = `?room_id=${roomId}`;
      }
      
      // Get sessions based on role
      axios
        .get(API_URL + `/managements/sessions/${queryParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.lessons = response.data;
          console.log("Sessions:", this.lessons);
          
          // Process teacher names for students if needed
          if (this.userRole === 'student') {
            this.lessons.forEach(lesson => {
              // Giả sử API trả về teacher ID, không phải teacher name
              if (lesson.teacher) {
                lesson.teacher.full_name = lesson.teacher.full_name || 'Chưa phân công';
              }
            });
          }
          
          // Tự động chọn ngày hiện tại sau khi lấy dữ liệu xong
          const today = this.formatDate(new Date());
          this.selectDay(today);
        })
        .catch((error) => {
          console.error("Error getting sessions:", error);
          this.$notify({
            type: "warning",
            icon: 'tim-icons icon-bell-55',
            message: `Lấy thời khóa biểu ${this.userRole === 'teacher' ? 'giáo viên' : 'học sinh'} thất bại`,
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        });
    },
    toggleSessionDetail(sessionId) {
      // Show session details if needed
      console.log("Session details:", sessionId);
      const session = this.selectedDayLessons.find(lesson => lesson.id === sessionId);
      if (session) {
        let messageContent = `Tiết ${session.time_slot.code}: ${session.subject_code.name} - Phòng ${session.room_id.name}`;
        
        // Add teacher name for students
        if (this.userRole === 'student' && session.teacher) {
          messageContent += ` - Giáo viên: ${session.teacher.full_name}`;
        }
        
        this.$notify({
          type: "info",
          icon: 'tim-icons icon-bell-55',
          message: messageContent,
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "right",
        });
      }
    }
  }
};
</script>

<style scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.timetable-title {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.timetable-title h2 {
  color: #1e88e5;
  margin-bottom: 5px;
}

.timetable-title p {
  color: #757575;
  margin: 0;
}

.custom-time-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.calendar-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
}

.calendar-section {
  flex: 1.2;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

.month-title {
  font-weight: bold;
  font-size: 1.3rem;
  color: white;
}

.nav-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  font-weight: bold;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  width: 100%;
}

.calendar-day {
  border: 1px solid #ddd;
  color: rgb(66, 174, 190);
  border-radius: 8px;
  padding: 5px;
  min-height: 70px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  background-color: white;
}

.calendar-day:hover {
  background-color: #28a745;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calendar-day.header {
  font-weight: bold;
  text-align: center;
  background-color: #f4f4f4;
  min-height: auto;
  padding: 10px;
  border: none;
  color: #616161;
}

.calendar-day.current-day {
  background-color: #d0ebff;
  border-color: #1e88e5;
}

.calendar-day.other-month {
  color: #aaa;
  background-color: #fafafa;
}

.calendar-day.has-lesson {
  background-color: rgba(40, 167, 69, 0.1);
  border: 2px solid #28a745;
  border-radius: 4px;
}

.calendar-day.selected-day {
  background-color: #bbdefb;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px #1976d2;
}

.day-number {
  position: absolute;
  top: 5px;
  left: 5px;
  font-weight: bold;
  font-size: 14px;
}

.day-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.lesson-dot {
  width: 6px;
  height: 6px;
  background-color: #43a047;
  border-radius: 50%;
  display: inline-block;
}

.lesson-list {
  flex: 1;
  background: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  font-size: 1.1rem;
}

.lesson-header {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.lesson-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.lesson-content {
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 500px;
}

.lesson-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lesson-list li {
  padding: 15px;
  margin-bottom: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  border-left: 4px solid #1e88e5;
}

.lesson-list li:hover {
  background-color: rgba(40, 167, 69, 0.1);
  border: 2px solid #28a745;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.lesson-time {
  background-color: #1e88e5;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
  margin-right: 15px;
  font-size: 14px;
  min-width: 60px;
  text-align: center;
}

.lesson-info {
  flex: 1;
}

.lesson-subject {
  font-weight: bold;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
}

.lesson-room {
  color: #757575;
  font-size: 14px;
}

.lesson-teacher {
  color: #757575;
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.lesson-teacher:before {
  content: '\f007';
  font-family: 'Font Awesome 5 Free';
  margin-right: 5px;
  color: #1e88e5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #9e9e9e;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state p {
  font-size: 16px;
}

@media (max-width: 992px) {
  .calendar-container {
    flex-direction: column;
  }
  
  .calendar-section, .lesson-list {
    width: 100%;
  }
  
  .lesson-list {
    margin-top: 20px;
  }
}
</style>