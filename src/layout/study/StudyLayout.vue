<template>
  <div class="wrapper study" :style="{ backgroundImage: `url(${require('@/assets/img/PG_bg_3.png')})` }">
    <div class="navbar">
      <div>
        <base-button @click="goToDashboard" class="dashboard-button" simple>
          <i class="tim-icons icon-minimal-left"></i> Trang chủ
        </base-button>
      </div>
      <!-- <div class="title">
        <h1 class="font-weight-bold text-dark">DẠY HỌC</h1>
      </div> -->
      <div class="current-time text-dark" style=" width: 180px">{{ currentTime }}</div>
      <div>
        <base-button @click="toggleEvaluate" class="dashboard-button" simple>
          <i class="tim-icons icon-notes"></i> Đánh giá
        </base-button>
      </div>
      
    </div>
    
    <div class="classroom-layout mt-3">
      <div v-for="(row, rowIndex) in desks" :key="rowIndex" class="row">
        <div v-for="(seat, columnIndex) in row" :key="columnIndex"
         :class="['seat', 
                      { 'spacer': columnIndex === 1 || columnIndex === 3 || columnIndex === 5 || columnIndex === 7}]"  
         @dragover.prevent @drop="dropStudent(rowIndex, columnIndex)" @dragstart="dragStart(seat,rowIndex,columnIndex)">
          <base-button
            v-if="seat"
            @click="scoringAndEnroll(seat)" 
            class="btn btn-simple"
            draggable
            :class="{'btn-info': getAttendanceStatus(seat.account) === 1, 'btn-danger': (getAttendanceStatus(seat.account) === 0) , 'btn': getAttendanceStatus(seat.account) === -1}"
            
          >
            <!-- {{ shortenName(seat.full_name) }}  -->
            {{shortenName(seat.full_name)}}
          </base-button>
        </div>
      </div>

      <div class="class-info">
        <table class="table table-bordered class-info-table">
          <thead>
            <tr>
              <th class="text-white">Lớp</th>
              <th class="text-white">Tiết</th>
              <th class="text-white">Môn</th>
              <th class="text-white">Sỹ số</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{this.lessonData ? this.lessonData.room_id.name : ""}}</td>
              <td>{{this.lessonData ? this.lessonData.time_slot.code : ""}}</td>
              <td>{{this.lessonData ? this.lessonData.subject_code.name : ""}}</td>
              <td> {{ ( this.attendances && this.positions ) ? this.countUsersWithStatus12(this.attendances)+"/" : "" }}<strong>{{this.positions.length }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="teacher-desk">
        <h3 class="text-dark">Bàn giáo viên</h3>
      </div>

      <!-- Scoring Modal -->
        <modal :show.sync="scoreModal"
       body-classes="p-0"
       modal-classes="modal-dialog-centered modal-lg">
    <card type="secondary"
          header-classes="bg-white pb-5"
          body-classes="px-lg-5 py-lg-5"
          class="border-0 mb-0">
        <template>
            <div class="text-muted mb-3">
                <h4 class="text-dark">Chấm điểm và Điểm danh</h4>
            </div>
        </template>
        <template>
            <div class="row">
                <!-- Card bên trái: Chấm điểm -->
                <div class="col-md-8">
                    <card type="secondary" header-classes="bg-white pb-2" class="border-0 mb-0">
                        <template>
                            <div class="text-muted mb-3">
                                <h5>Chấm điểm</h5>
                            </div>
                        </template>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input disabled label="Id học sinh" v-model="studentDetail.id"></base-input>
                            </div>
                            <div class="col-md-6">
                                <base-input disabled label="Họ và tên" v-model="studentDetail.full_name"></base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <base-input label="Điểm" v-model="studentDetail.grade"></base-input>
                            </div>
                        </div>
                        <div class="d-flex mt-4">
                            <base-button @click="givenScore" type="secondary" fill>Chấm điểm</base-button>
                        </div>
                    </card>
                </div>

                <!-- Card bên phải: Trạng thái điểm danh -->
                <div class="col-md-4">
                  <card type="secondary" header-classes="bg-white pb-2" class="border-0 mb-0">
                      <template>
                          <div class="text-muted mb-3">
                              <h5>Trạng thái điểm danh</h5>
                          </div>
                      </template>
                      <div class="container text-center"> <!-- Thêm class text-center -->
                          <div class="row justify-content-center"> <!-- Căn giữa với justify-content-center -->
                              <div class="col-xs-12">
                                  <div class="switch">
                                      <input id="switch-present" name="attendance" type="radio" value="1" v-model="newStatus" class="switch-input" @change="updateStatus" />
                                      <label for="switch-present" class="switch-label switch-label-y"><i class="tim-icons icon-check-2"></i></label>
                                      
                                      <!-- <input id="switch-late" name="attendance" type="radio" value="2" v-model="newStatus" class="switch-input" @change="updateStatus"/>
                                      <label for="switch-late" class="switch-label switch-label-i"><i class="tim-icons icon-simple-delete"></i></label> -->
                                      
                                      <input id="switch-absent" name="attendance" type="radio" value="0" v-model="newStatus" class="switch-input" @change="updateStatus"/>
                                      <label for="switch-absent" class="switch-label switch-label-n"><i class="tim-icons icon-simple-remove"></i></label>
                                      
                                      <span class="switch-selector"></span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="text-muted mt-2">
                          <span v-if="newStatus == 1" class="text-success">Có mặt</span>
                          <span v-if="newStatus != 0 && newStatus != 1" class="text-warning">Chưa điểm danh</span>
                          <span v-if="newStatus == 0" class="text-danger">Vắng mặt</span>
                      </div>
                  </card>
              </div>
            </div>
        </template>
    </card>
</modal>




        <!-- Evaluating Modal -->
        <modal :show.sync="evaluateModal"
                body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0">
                <template>
                    <div class="text-muted mb-3">
                        <h4 class="text-dark">Đánh giá tiết học</h4>
                    </div>
                </template>
                <template>
                        <div class="row">
                            <div class="col-12" v-if="lessonDetail">
                              <div class="row">
                                    <div class="col-md-4 pr-md-1">
                                        <base-input label="Bài số" v-model="lessonDetail.lessonNumber" placeholder="Bài số">
                                        </base-input>
                                    </div>
                                    <div class="col-md-4 pr-md-1">
                                        <base-input label="Tên bài học" v-model="lessonDetail.nameLesson" placeholder="Tên bài học">
                                        </base-input>
                                    </div>
                                    <div class="col-md-4 pr-md-1">
                                        <base-input disabled label="Vắng" v-model="lessonDetail.absences" placeholder="Vắng" v-if="positions && attendances">
                                        </base-input>
                                    </div>
                              </div>
                              <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <label>Điểm đánh giá</label>
                                        <div class="d-flex justify-content-around mt-2">
                                            <div class="grade-option">
                                                <input type="radio" id="evaluateA" name="evaluate" class="grade-input" value="A" v-model="lessonDetail.evaluate">
                                                <label for="evaluateA" class="grade-label grade-a">A</label>
                                            </div>
                                            <div class="grade-option">
                                                <input type="radio" id="evaluateB" name="evaluate" class="grade-input" value="B" v-model="lessonDetail.evaluate">
                                                <label for="evaluateB" class="grade-label grade-b">B</label>
                                            </div>
                                            <div class="grade-option">
                                                <input type="radio" id="evaluateC" name="evaluate" class="grade-input" value="C" v-model="lessonDetail.evaluate">
                                                <label for="evaluateC" class="grade-label grade-c">C</label>
                                            </div>
                                            <div class="grade-option">
                                                <input type="radio" id="evaluateD" name="evaluate" class="grade-input" value="D" v-model="lessonDetail.evaluate">
                                                <label for="evaluateD" class="grade-label grade-d">D</label>
                                            </div>
                                        </div>
                                    </div>
                              </div>
                              <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Nhận xét">
                                          <textarea class="form-control" rows="3" v-model="lessonDetail.comment"></textarea>
                                        </base-input>
                                    </div>
                              </div>
                              <base-button @click="evaluating" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>
        </modal>
    </div>
  </div>
</template>

<script>
import axios from '../../services/axios'; 
import Modal from '../../components/Modal.vue';

let API_URL = ""

export default {
  components: { Modal },
  mounted() {
    this.startLongPolling();
    this.getRoomId();
  },
  data() {
    return {
      attendances: null,
      currentStatus: null,
      newStatus: null,
      attendanceStatus: 1,

      isActive: false,
      attendance: [],
      scoreModal : false,
      evaluateModal: false,

      polling: false,

      lessonData: null,
      rooms: null,

      lessonDetail: {
        semester: null,
        day: null,
        room: null,
        period_number: null,
        lessonNumber: null,
        nameLesson: null,
        teacher: null,
        comment: null,
        evaluate: null,
        absences : null,
      },

      studentDetail: {
        id: null,
        full_name: null,
        subject: null,
        semester: null,
        score_type: null,
        grade: null,
      },

      currentTime: this.formatTime(new Date()),
      positions: null,
      desks: Array.from({ length: 5 }, () => Array(8).fill(null)),
      draggedStudent: null,
      draggedRow: null,
      draggedCol: null,
    };
  },
  methods: {
    getRoomId(){
      const lessonDataStr = localStorage.getItem("lesson_data");
      if (!lessonDataStr) {
        console.error("No lesson data found in localStorage");
        return;
      }
      try {
        this.lessonData = JSON.parse(lessonDataStr);
      } catch (error) {
        console.error("Error parsing lesson data:", error);
      }
    },
    countUsersWithStatus12(attendances) {
        // Kiểm tra nếu attendances là null hoặc undefined
        if (!attendances) return 0;
        
        // Lọc các đối tượng có status là 1 hoặc 2
        const filteredUsers = attendances.filter(item => item.status );
        
        // Đếm số lượng các user có status = 1 hoặc 2
        return filteredUsers.length;
    },
    
    demo(){
      return true;
    },
    getAttendanceStatus(studentId) {
      // Lọc danh sách attendance dựa trên studentId
      if(!this.attendance || !this.attendance.length) return -1;
      
      const studentAttendance = this.attendance.filter(
        (att) => att.student && att.student.account === studentId
      );

      // Nếu không có dữ liệu, trả về trạng thái chưa điểm danh = -1
      if (studentAttendance.length === 0) {
        return -1;
      }

      // Kiểm tra trạng thái cuối cùng của sinh viên
      const lastStatus = studentAttendance[studentAttendance.length - 1].status;
      return lastStatus ? 1 : 0
    },
    async startLongPolling() {
      let lastAttendance = [];
      this.polling = true;

      // Sử dụng setInterval với khoảng thời gian 500ms
      this.pollingInterval = setInterval(async () => {
        if (!this.polling) {
          clearInterval(this.pollingInterval);
          return;
        }

        // Kiểm tra xem lessonData đã được load chưa
        if (!this.lessonData || !this.lessonData.id) {
          console.log("Waiting for lesson data to be loaded...");
          return;
        }

        try {
          const token = localStorage.getItem("access_token");
          const response = await axios.get(`${API_URL}/rooms_managements/attendances/?session=${this.lessonData.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          this.attendances = response.data;
          this.attendance = response.data || []; // Cập nhật attendance từ attendances
          this.attendanceNumber = this.attendances ? this.attendances.length : 0;
          const newAttendance = response.data || [];

          if (JSON.stringify(newAttendance) !== JSON.stringify(lastAttendance)) {
            const differences = this.getDifferences(lastAttendance, newAttendance);
            if (differences.length > 0) {
              this.attendances = newAttendance;
              this.attendance = newAttendance; // Cập nhật cả hai biến
              console.log('New attendance data:', this.attendance);

              if (differences.length !== newAttendance.length) {
                differences.forEach(difference => {
                  if (difference.status === 1 && difference.lesson == this.lessonData.id) {
                    // this.$notify({
                    //   type: "success",
                    //   icon: 'tim-icons icon-badge',
                    //   title: "Điểm danh thành công",
                    //   message: `Học sinh ${difference.user}`,
                    //   timeout: 1000,
                    //   verticalAlign: "bottom",
                    //   horizontalAlign: "left",
                    // });
                  }
                });
              }
              lastAttendance = newAttendance;
            }
          }

        } catch (error) {
          console.error('Error fetching attendance data:', error);
        }
      }, 500); // Polling mỗi 0.5 giây
    },

    // Hàm để lấy ra các phần tử khác nhau
    getDifferences(oldData, newData) {
      const differences = [];

      // Chuyển đổi dữ liệu cũ thành một đối tượng để dễ dàng so sánh
      const oldDataMap = new Map(oldData.map(item => [item.id, item]));

      // So sánh từng phần tử trong dữ liệu mới với dữ liệu cũ
      newData.forEach(newItem => {
        const oldItem = oldDataMap.get(newItem.id);
        if (!oldItem || JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
          differences.push(newItem);
        }
      });

      return differences;
    },
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    shortenName(fullName) {
      const nameParts = fullName.trim().split(' '); // Tách tên thành các phần
      if (nameParts.length == 3) return nameParts.slice(1).join(' '); // Nếu chỉ có một phần, trả về tên gốc
      if (nameParts.length == 4) return nameParts.slice(2).join(' '); // Lấy các phần sau họ và ghép lại
      return fullName
    },
    scoringAndEnroll(index){
      this.studentDetail.id = index.seating.student
      this.studentDetail.full_name = index.full_name
      this.studentDetail.subject = this.lessonData.subject_code.code
      this.studentDetail.semester = this.lessonData.semester_code.code

      this.currentStatus = this.getAttendanceStatus(index.account);
      this.newStatus = this.currentStatus;
      console.log("current and new"+this.currentStatus)

      this.scoreModal = true
    },
    updateStatus(){
      console.log(this.studentDetail.id)
      
      if(!this.attendance || !this.attendance.length) {
        this.createStatus();
        return;
      }
      
      const studentAttendance = this.attendance.filter(
        (att) => att.student_account === this.studentDetail.id
      );

      if(studentAttendance.length === 0) {
        this.createStatus();
        return;
      }

      // Kiểm tra trạng thái cuối cùng của sinh viên
      const studentAttendanceId = studentAttendance[studentAttendance.length - 1].id;

      console.log("current"+this.currentStatus)
      console.log("new"+this.newStatus)
      if(this.currentStatus == this.newStatus) return 
      else {
        //update status
        let data = {
          "session_id": this.lessonData.id,
          "student_account": this.studentDetail.id,
          "status": this.newStatus == 0 ? false : true
        }
        const token = localStorage.getItem("access_token");
        
        console.log(data)

        axios
        .put(API_URL+`/rooms_managements/attendances/${studentAttendanceId}/`, data,  {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.currentStatus = this.newStatus 
          this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Đổi trạng thái học sinh " + this.studentDetail.id+ " thành công",
                timeout: 1000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        })
        .catch((error) => {
          console.error("Error post grade data :", error);
          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Đổi trạng thái thất bại. Vui lòng thử lại sau",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });       
      }
    },
    createStatus(){
      let data = {
          "session_id": this.lessonData.id,
          "student_account": this.studentDetail.id,
          "status": false
        }
        console.log(data)
        const token = localStorage.getItem("access_token");
        
        console.log(data)

        axios
        .post(API_URL+"/rooms_managements/attendances/", data,  {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.currentStatus = response.data.status ? 1 : 0
          this.newStatus = this.currentStatus ? 1 : 0
          this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Thêm trạng thái điểm danh thành công",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        })
        .catch((error) => {
          console.error("Error post grade data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Thêm trạng thái điểm danh thất bại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    givenScore(){
      if(!this.studentDetail.grade){
        this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Vui lòng nhập điểm cho học sinh",
                timeout: 1000,
                verticalAlign: "top",
                horizontalAlign: "right",
        });
        return
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
      const day = String(currentDate.getDate()).padStart(2, '0');        // Đảm bảo luôn có 2 chữ số

      const date_assigned =  `${year}-${month}-${day}`;

      const data = {
        "student": this.studentDetail.id,
        "subject": this.studentDetail.subject,
        "semester": this.studentDetail.semester,
        "grade_type": 1,
        "score": this.studentDetail.grade,
        "date_assigned": date_assigned
      }

      console.log(data)
      const token = localStorage.getItem("access_token");

        axios
        .post(API_URL+"/academic_results/grades/", data,  {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.scoreModal = false
          this.studentDetail.grade = null
          this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Chấm điểm cho học sinh " + this.studentDetail.full_name+ " thành công",
                timeout: 1000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        })
        .catch((error) => {
          console.error("Error post grade data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Chấm điêm thất bại. Vui lòng thử lại sau",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    toggleEvaluate(){
      this.lessonDetail.absences = this.positions.length - this.countUsersWithStatus12(this.attendances)
      this.evaluateModal = true;
    },
    evaluating(){
      if(!this.lessonDetail.evaluate) {
        this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Vui lòng cho điểm đánh giá tiết học",
                timeout: 1000,
                verticalAlign: "top",
                horizontalAlign: "right",
        });
        return
      }
      
      // Kiểm tra xem điểm đánh giá có hợp lệ không
      if (!['A', 'B', 'C', 'D'].includes(this.lessonDetail.evaluate)) {
        this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Điểm đánh giá phải là A, B, C hoặc D",
                timeout: 1000,
                verticalAlign: "top",
                horizontalAlign: "right",
        });
        return
      }
      
      if(!this.lessonDetail.comment) {
        this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Vui lòng cho nhận xét tiết học",
                timeout: 1000,
                verticalAlign: "top",
                horizontalAlign: "right",
        });
        return
      }
      console.log(this.attendanceNumber)
      if(this.positions.length != this.attendanceNumber){
        this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Vui lòng cho cập nhật trạng thái điểm danh cho tất cả học sinh",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
        });
        return
      }

      const data = {
        "comment": this.lessonDetail.comment,
        "grade": this.lessonDetail.evaluate,        
        "lesson_number": this.lessonDetail.lessonNumber,
        "lesson_name": this.lessonDetail.nameLesson,
        "absences": this.lessonDetail.absences
      }
      console.log(data)
      
      const token = localStorage.getItem("access_token");

        axios
        .patch(API_URL+`/managements/sessions/${this.lessonData.id}/`, data,  {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Đánh giá tiết học thành công",
                timeout: 1000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
              this.evaluateModal = false
        })
        .catch((error) => {
          console.error("Error:", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Đánh giá tiết học thất bại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    async initializeData() {
      try {
        await this.getApiUrl();
        await this.getPositionData();
        this.startLongPolling()
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    },
    getApiUrl() {
      return new Promise((resolve) => {
        API_URL = this.$t("dashboard.apiURL");
        resolve();
      });
    },
    dragStart(student, row, col) {
      this.draggedStudent = student; 
      this.draggedRow = row;
      this.draggedCol = col;
      console.log("start Drag"+student)
    },
    dropStudent(rowIndex, columnIndex) {
      if (this.draggedStudent) {
        const targetStudent = this.desks[rowIndex][columnIndex];
        if(!targetStudent) {
          this.desks[rowIndex][columnIndex] = this.draggedStudent; // Đặt học sinh kéo tới vị trí mới
          this.desks[this.draggedRow][this.draggedCol] = null; // vị trí trước đó là null
          //Cập nhật vị trí mới cho học sinh
          this.updatePosition(this.draggedStudent, rowIndex, columnIndex);
        }
        else {
          this.desks[rowIndex][columnIndex] = this.draggedStudent;
          this.desks[this.draggedRow][this.draggedCol] = targetStudent;
          this.swapPosition(this.draggedStudent, targetStudent);
        }
      }
    },
    updatePosition(student, row, col){
      const token = localStorage.getItem("access_token");
      const data = {
        "row": row+1,
        "column": col+1,
        "student": student.seating.student,
        "room": student.seating.room
      }
        axios
        .put(API_URL+"/rooms_managements/seatings/"+ student.seating.id +"/", data, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Đổi vị trí học sinh thành công",
                timeout: 1500,
                verticalAlign: "bottom",
                horizontalAlign: "left",
              });
        })
        .catch((error) => {
          console.error("Error get lesson data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Đổi vị trí không thành công. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    swapPosition(student1, student2){
      const token = localStorage.getItem("access_token");
      const data = {
        "user_id_1": student1.seating.student,
        "user_id_2": student2.seating.student
      }
        axios
        .post(API_URL+"/rooms_managements/seatings/swap_seats/", data, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Hoán đổi vị trí học sinh thành công",
                timeout: 1500,
                verticalAlign: "bottom",
                horizontalAlign: "left",
              });
        })
        .catch((error) => {
          console.error("Error get lesson data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Đổi vị trí không thành công. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    formatPositionData(positions) {
      positions.forEach(position => {
        if(!position.seating) return;
        const columnIndex = position.seating.column - 1; 
        const rowIndex = position.seating.row - 1; 
        this.$set(this.desks[rowIndex], columnIndex, position); 
      });
      console.log(this.desks)
      return this.desks;
    },
    formatTime(date) {
      return date.toLocaleTimeString();
    },
    goToDashboard() {
      this.polling = false
      this.$router.push('/profile');  
    },
    async getPositionData() {
      
      const roomId = this.lessonData.room_id.id
      console.log(this.lessonData)
      this.lessonDetail.lessonNumber = this.lessonData.lesson_number
      this.lessonDetail.nameLesson = this.lessonData.lesson_name
      this.lessonDetail.evaluate = this.lessonData.grade
      this.lessonDetail.comment = this.lessonData.comment
     
      
      console.log(roomId)
      const token = localStorage.getItem("access_token");
      try {
        // const response = await axios.get(`${API_URL}/rooms/${roomName}/allseatings/`, {
        // const response = await axios.get(`${API_URL}/rooms_managements/seatings/?room=${roomId}`, {
        const response = await axios.get(`${API_URL}/users/students/?rooms=${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        this.positions = response.data;
        if (response.data.length === 0) {
          this.$notify({
            type: "warning",
            icon: 'tim-icons icon-bell-55',
            message: "Không tồn tại danh sách chỗ ngồi của lớp",
            timeout: 3000,
            verticalAlign: "bottom",
            horizontalAlign: "right",
          });
        } else {
          console.log(this.positions)
          this.desks = this.formatPositionData(this.positions);
        }
      } catch (error) {
        console.error("Error getting seating data:", error);
      }
    },
  },
  created() {
    setInterval(() => {
      this.currentTime = this.formatTime(new Date());
    }, 1000);
    this.initializeData(); 
  }
};
</script>

<style >
.study {
  text-align: center;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.dashboard-button {
  margin-right: auto;
}

.title {
  flex-grow: 1;
}

.current-time {
  margin-left: auto;
  font-size: 30px;
}

.classroom-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.seat {
  border: 2px solid gray;
  width: 130px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.student {
  padding: 10px;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
}

.teacher-desk {
  border: 2px solid black;
  padding: 20px;
  position: absolute;
  border-radius: 5px;
  bottom: 50px;
  right: 160px;
}
.spacer {
  margin-right: 50px; /* Khoảng cách giữa các cột */
}

.container {
  margin-top: 20px;
  width: 100%;
}

.switch {
    position: relative;
    height: 32px;
    width: 140px;
    margin: 20px auto;
    background: #d7d7d789;
    border-radius: 32px;
}

.switch-label {
    font-weight: bold;
    position: relative;
    z-index: 2;
    float: left;
    width: 70px; /* Thay đổi giá trị này để mở rộng chiều rộng của label */
    line-height: 32px; /* Giữ cho icon được căn giữa trong switch */
    font-size: 24px; /* Tăng kích thước chữ nếu cần */
    color: #676a6c;
    text-align: center;
    cursor: pointer;
}

.switch-input {
  display: none;
}

.switch-input:checked + .switch-label {
  color: #fff;
  transition: color 0.15s ease-out, text-shadow 0.15s ease-out;
}

.switch-input:checked + .switch-label-y ~ .switch-selector {
  transform: translateX(0%);
  background-color: #1ab394; /* Màu xanh cho 'Có mặt' */
}

.switch-input:checked + .switch-label-i ~ .switch-selector {
  transform: translateX(100%);
  background-color: #f8ac59; /* Màu vàng cho 'Đi muộn' */
}

.switch-input:checked + .switch-label-n ~ .switch-selector {
  transform: translateX(200%);
  background-color: #ed5565; /* Màu đỏ cho 'Vắng mặt' */
}

.switch-selector {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 33.33%;
  height: 32px;
  border-radius: 32px;
  background-color: #1ab394;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.switch-label {
    white-space: nowrap; /* Ngăn không cho chữ xuống dòng */
}

.switch-label i {
    font-size: 12px; /* Điều chỉnh kích thước icon */
    line-height: 32px; /* Giữ cho icon được căn giữa trong switch */
    transition: font-size 0.3s; /* Hiệu ứng chuyển đổi khi thay đổi kích thước */
}

/* Tùy chọn cho trạng thái checked */
.switch-input:checked + .switch-label i {
    font-size: 28px; /* Kích thước lớn hơn khi được chọn */
}

.class-info {
  position: absolute;
  bottom: 35px; /* Adjust vertical position */
  left: 120px;   /* Adjust horizontal position */
}
.class-info-table {
  width: 240px; /* Điều chỉnh kích thước */
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Hiệu ứng đổ bóng */
}

.class-info-table th {
  background-color: #007bff; /* Màu nền phần header */
  color: white;
  font-weight: bold;
  padding: 10px; /* Tạo khoảng cách trong ô */
  text-align: center;
  position: relative;
}

.class-info-table th:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 2px;
  background-color: #f2f2f21f; /* Màu sắc đường ngăn cách */
}

.class-info-table td {
  padding: 8px;
  text-align: center;
  color: #333;
}

.class-info-table tr:nth-child(even) {
  background-color: #f2f2f2; /* Màu nền so le */
}

/* Styling cho các nút điểm đánh giá */
.grade-option {
  position: relative;
  display: inline-block;
  margin: 0 10px;
}

.grade-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.grade-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: 3px solid transparent;
}

.grade-a {
  background-color: #1ab394;
}

.grade-b {
  background-color: #1c84c6;
}

.grade-c {
  background-color: #f8ac59;
}

.grade-d {
  background-color: #ed5565;
}

.grade-input:checked + .grade-label {
  transform: scale(1.15);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-color: #ffffff;
}

.grade-input:hover + .grade-label {
  transform: scale(1.1);
}

</style>
