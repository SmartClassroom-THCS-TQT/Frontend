<template>
  <div class="row">
    <div class="col-12">
      <!-- <div class="wrapper study"> -->
      <card class="wrapper study">
        <div>
          <div class="title">
            <h1 class="font-weight-bold">Quản lý chỗ ngồi lớp {{room.name}}</h1>
          </div>
          <base-button @click="toggleSeatingModal" class="dashboard-button btn-info" simple>
              <i class="tim-icons icon-components"></i> Xếp chỗ
            </base-button>
        </div>
        <!-- Seating Modal -->
            <modal :show.sync="seatingModal"
                    body-classes="p-0"
                  modal-classes="modal-dialog-centered modal-md">
                <card type="secondary"
                      header-classes="bg-white pb-5"
                      body-classes="px-lg-5 py-lg-5"
                      class="border-0 mb-0">
                    <template>
                        <div class="text-muted mb-3">
                            <h4 class="text-dark">Danh sách học sinh chưa có chỗ ngồi</h4>
                        </div>
                    </template>
                    <template>
                            <ul>
                                <li v-for="student in unassignedStudents" :key="student">
                                    <base-button v-if="student" @click="assignStudent(student)" class="dashboard-button btn-info" simple>
                                        <!-- {{ student? shortenName( student.full_name) : "" }} -->
                                        {{shortenName(student.full_name)}}
                                    </base-button>
                                </li>
                            </ul>
                    </template>
                </card>
            </modal>
        
        <div class="classroom-layout mt-3">
          <div v-for="(row, rowIndex) in desks" :key="rowIndex" class="classroom-row">
            <div v-for="(seat, columnIndex) in row" :key="columnIndex"
            :class="['classroom-seat', 
                          { 'classroom-spacer': columnIndex === 1 || columnIndex === 3 || columnIndex === 5 || columnIndex === 7}]"  
            @dragover.prevent @drop="dropStudent(rowIndex, columnIndex)" @dragstart="dragStart(seat,rowIndex,columnIndex)">
              <base-button
                v-if="seat"
                class="btn-info btn-simple classroom-student"
                draggable
              >
                {{shortenName(seat.full_name) }} <!-- Assuming 'seat' is an object with 'student' having a 'name' property -->
              </base-button>
              <base-button
                v-if="!seat && seatingPermission"
                class="btn-success btn-simple classroom-student"
                draggable
                @click="createPosition(rowIndex,columnIndex)"
              >
                <i class="tim-icons icon-simple-add"></i>
              </base-button>
            </div>
          </div>

          <div class="classroom-teacher-desk">
            <h3>Bàn giáo viên</h3>
          </div>
        </div>
      </card>
      <!-- </div> -->
    </div>
  </div>
  
</template>

<script>
import axios from "../../services/axios";
import Card from "../../components/Cards/Card.vue";
import Modal from '../../components/Modal.vue';

let API_URL = ""

export default {
  props: {
    room: {
      type: Object, 
      required: true,
      default: "room",
    }
  },
  mounted() {
    this.initializeData();
    },
  components: { Modal },
  data() {
    return {
      studentSelected: null,
      unassignedStudents: [],
      seatingPermission: false,
      seatingArrangement: [],

      seatingModal: false,

      isActive: false,
      attendance: null,
      scoreModal : false,
      evaluateModal: false,

      students: null,

      lessonDetail: {
        semester: null,
        day: null,
        room: null,
        period_number: null,
        lessonNumber: null,
        nameLesson: null,
        teacher: null,
        comment: null,
        evaluate: null

      },

      studentDetail: {
        id: null,
        full_name: null,
        subject: null,
        semester: null,
        score_type: null,
        grade: null,
      },

      positions: null,
      desks: Array.from({ length: 5 }, () => Array(8).fill(null)),
      draggedStudent: null,
      draggedRow: null,
      draggedCol: null,
    };
  },
  methods: {
    shortenName(fullName) {
      const nameParts = fullName.trim().split(' '); // Tách tên thành các phần
      if (nameParts.length == 3) return nameParts.slice(1).join(' '); // Nếu chỉ có một phần, trả về tên gốc
      if (nameParts.length == 4) return nameParts.slice(2).join(' '); // Lấy các phần sau họ và ghép lại
      return fullName
    },
    createPosition(row, col){
      const token = localStorage.getItem("access_token");
      const data = {
        "student":this.studentSelected.account,
        "room": this.room.id,
        "row": row+1,
        "column": col+1
      }
      console.log(data)
        axios
        .post(API_URL+"/rooms_managements/seatings/", data, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
            this.getPositionData()
          this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Thêm chỗ ngồi học sinh "+ this.studentSelected.full_name + " thành công",
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
                message: "Thêm chỗ ngồi không thành công. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });

      this.seatingPermission=false
    },
    assignStudent(student) {
      this.seatingModal = false
      this.studentSelected = student
      this.seatingPermission = true
    },
    toggleSeatingModal(){
        console.log("stundents")
        // console.log(this.room.students)
        // this.unassignedStudents = this.room.students.filter(student => {
        //     // Kiểm tra nếu học sinh không có trong danh sách positions
        //     return !this.positions.some(position => {
        //      position.seating && position.seating.student === student.account});
        // });
        this.unassignedStudents = this.positions.filter(student => !student.seating);

        if(this.unassignedStudents.length == 0){
          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Không có học sinh nào chưa có chỗ",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
              return
        }
        this.seatingModal = true;
    },
    getStudents(roomId){
      const token = localStorage.getItem("access_token");
      
        axios
        .get(API_URL+`/users/students/?rooms=${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
            this.students = response.data
        })
        .catch((error) => {
          console.error("Error get lesson data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Lấy chi tiết danh sách học sinh thất bại",
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
        await this.getStudents(this.room.id);
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
    // dropStudent(rowIndex, columnIndex) {
    //   if (this.draggedStudent) {
    //     const targetStudent = this.desks[rowIndex][columnIndex];
    //     if(!targetStudent) {
    //       this.desks[rowIndex][columnIndex] = this.draggedStudent; // Đặt học sinh kéo tới vị trí mới
    //       this.desks[this.draggedRow][this.draggedCol] = null; // vị trí trước đó là null
    //       //Cập nhật vị trí mới cho học sinh
    //       this.updatePosition(this.draggedStudent.user, rowIndex, columnIndex);
    //     }
    //     else {
    //       this.desks[rowIndex][columnIndex] = this.draggedStudent;
    //       this.desks[this.draggedRow][this.draggedCol] = targetStudent;
    //       this.swapPosition(this.draggedStudent, targetStudent);
    //     }
    //   }
    // },
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
    // updatePosition(studentId, row, col){
    //   const token = localStorage.getItem("access_token");
    //   const data = {
    //     "row": row+1,
    //     "column": col+1
    //   }
    //     axios
    //     .patch(API_URL+"/rooms/seating-positions/"+ studentId +"/", data, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Đính kèm token vào headers
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then((response) => {
    //         this.getPositionData()
    //       this.$notify({
    //             type: "success",
    //             icon: 'tim-icons icon-bell-55',
    //             message: "Đổi vị trí học sinh "+ response.data.student_details.full_name + " thành công",
    //             timeout: 1500,
    //             verticalAlign: "bottom",
    //             horizontalAlign: "left",
    //           });
    //     })
    //     .catch((error) => {
    //       console.error("Error get lesson data :", error);

    //       this.$notify({
    //             type: "warning",
    //             icon: 'tim-icons icon-bell-55',
    //             message: "Đổi vị trí không thành công. Vui lòng thử lại",
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     });
    // },
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
              this.getPositionData();
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
              this.getPositionData();
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
    // swapPosition(student1, student2){
    //   const token = localStorage.getItem("access_token");
    //   const data = {
    //     "user_id_1": student1.user,
    //     "user_id_2": student2.user
    //   }
    //     axios
    //     .post(API_URL+"/rooms/seating-positions/swap_seats/", data, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Đính kèm token vào headers
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then(() => {
    //         this.getPositionData()
    //       this.$notify({
    //             type: "success",
    //             icon: 'tim-icons icon-bell-55',
    //             message: "Đổi vị trí học sinh "+student1.full_name+" và "+student2.full_name + " thành công",
    //             timeout: 1500,
    //             verticalAlign: "bottom",
    //             horizontalAlign: "left",
    //           });
    //     })
    //     .catch((error) => {
    //       console.error("Error get lesson data :", error);

    //       this.$notify({
    //             type: "warning",
    //             icon: 'tim-icons icon-bell-55',
    //             message: "Đổi vị trí không thành công. Vui lòng thử lại",
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     });
    // },
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
    async getPositionData() {
      const roomId = this.room.id
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
        console.log(this.positions)
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
          this.desks = this.formatPositionData(this.positions);
        }
      } catch (error) {
        console.error("Error getting seating data:", error);
      }
    },
    // async getPositionDataOld() {
    //   const token = localStorage.getItem("access_token");
    //   try {
    //     // const response = await axios.get(`${API_URL}/rooms/${roomName}/allseatings/`, {
    //     const response = await axios.get(`${API_URL}/rooms/seating-positions/?room=${this.room.name}`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     this.positions = response.data;
    //     console.log(this.positions)
    //     if (response.data.length === 0) {
    //       this.$notify({
    //         type: "warning",
    //         icon: 'tim-icons icon-bell-55',
    //         message: "Không tồn tại danh sách chỗ ngồi của lớp",
    //         timeout: 3000,
    //         verticalAlign: "bottom",
    //         horizontalAlign: "right",
    //       });
    //     } else {
    //       this.desks = this.formatPositionData(this.positions);
    //     }
    //   } catch (error) {
    //     console.error("Error getting seating data:", error);
    //   }
    // },
  },
};
</script>

<style>

.classroom-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.classroom-row {
  display: flex;
  margin-bottom: 10px;
}

.classroom-seat {
  border: 1px solid #DAA520;
  width: 100px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.classroom-student {
  padding: 10px;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
}

.classroom-teacher-desk {
  border: 2px solid #ff6347;
  padding: 20px;
  position: absolute;
  border-radius: 5px;
  bottom: 50px;
  right: 160px;
}
.classroom-spacer {
  margin-right: 50px; /* Khoảng cách giữa các cột */
}

.container {
  margin-top: 20px;
  width: 100%;
}

</style>