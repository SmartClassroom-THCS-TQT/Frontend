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
                <div class="col-md-12 text-right">
                  <base-button 
                    class="btn btn-sm"
                    @click="refreshScores"
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

        <!-- Bảng điểm -->
        <div>
          <base-table 
            :data="students" 
            :columns="score_columns"
            :per-page="10"
            :pagination-active="true"
          >
            <template slot="columns">
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Điểm</th>
              <th class="text-right">Actions</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.account }}</td>
              <td>{{ row.full_name }}</td>
              <td>{{ formatScores(row.scores) }}</td>
              <td class="td-actions text-right">
                <base-button type="info" class="btn-simple" size="md" icon @click="toggleDetailScore(row)">
                  <i class="tim-icons icon-pencil"></i>
                </base-button>
              </td>
            </template>
          </base-table>
        </div>
      </card>
      
      <!-- Score Detail Modal -->
      <modal 
        :show.sync="scoreDetailModal"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-lg"
      >
        <card 
          type="secondary"
          header-classes="bg-white pb-3"
          body-classes="px-lg-5 py-lg-3"
          class="border-0 mb-0"
          v-if="scoreDetail"
        >
          <template slot="header">
            <div class="text-center mb-2">
              <h4 class="text-dark">Thông tin điểm học sinh: {{ scoreDetail.full_name }}</h4>
              <p class="text-muted">ID: {{ scoreDetail.student_id }}</p>
            </div>
          </template>
          
          <div>
            <div class="table-responsive">
              <table class="table align-items-center">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">Ngày</th>
                    <th scope="col">Loại điểm</th>
                    <th scope="col">Điểm</th>
                    <th scope="col" class="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="scoreDetail.grades && scoreDetail.grades.length === 0">
                    <td colspan="4" class="text-center">Không có dữ liệu điểm</td>
                  </tr>
                  <tr v-for="(grade, index) in scoreDetail.grades" :key="index">
                    <td>
                      <div v-if="editingGrade && editingGrade.id === grade.id">
                        <input 
                          type="date" 
                          class="form-control"
                          v-model="editingGrade.date_assigned"
                        />
                      </div>
                      <span v-else>{{ formatDate(grade.date_assigned) }}</span>
                    </td>
                    <td>
                      <div v-if="editingGrade && editingGrade.id === grade.id">
                        <select class="form-control" v-model="editingGrade.grade_type">
                          <option :value="1">Kiểm tra thường xuyên</option>
                          <option :value="2">Kiểm tra thường xuyên</option>
                          <option :value="3">Kiểm tra thường xuyên</option>
                        </select>
                      </div>
                      <span v-else>{{ getGradeTypeName(grade.grade_type) }}</span>
                    </td>
                    <td>
                      <div v-if="editingGrade && editingGrade.id === grade.id">
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="editingGrade.score"
                          min="0"
                          max="10"
                          step="0.5"
                        />
                      </div>
                      <span v-else>{{ grade.score }}</span>
                    </td>
                    <td class="td-actions text-right">
                      <div v-if="editingGrade && editingGrade.id === grade.id">
                        <base-button type="success" size="sm" class="btn-simple mr-1" @click="saveEditGrade()">
                          <i class="tim-icons icon-check-2"></i>
                        </base-button>
                        <base-button type="default" size="sm" class="btn-simple" @click="cancelEdit()">
                          <i class="tim-icons icon-simple-remove"></i>
                        </base-button>
                      </div>
                      <div v-else>
                        <base-button type="info" size="sm" class="btn-simple mr-1" @click="startEditGrade(grade)">
                          <i class="tim-icons icon-pencil"></i>
                        </base-button>
                        <base-button type="danger" size="sm" class="btn-simple" @click="confirmDeleteGrade(grade)">
                          <i class="tim-icons icon-simple-remove"></i>
                        </base-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Add new grade section -->
            <div class="row mt-4">
              <div class="col-12">
                <h5 class="mb-3">Thêm điểm mới</h5>
                <div class="row">
                  <div class="col-md-3">
                    <base-input
                      label="Ngày"
                      type="date"
                      v-model="newGrade.date_assigned"
                    ></base-input>
                  </div>
                  <div class="col-md-3">
                    <label>Loại điểm</label>
                    <select class="form-control" v-model="newGrade.grade_type">
                      <option :value="1">Kiểm tra thường xuyên</option>
                      <!-- <option :value="2">Kiểm tra giữa kỳ</option>
                      <option :value="3">Kiểm tra cuối kỳ</option> -->
                    </select>
                  </div>
                  <div class="col-md-3">
                    <base-input
                      label="Điểm"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      v-model="newGrade.score"
                    ></base-input>
                  </div>
                  <div class="col-md-3 d-flex align-items-end">
                    <base-button 
                      type="" 
                      class="mb-3"
                      @click="addNewGrade"
                      :disabled="!isNewGradeValid"
                    >
                      Thêm điểm
                    </base-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <template slot="footer">
            <base-button type="default" @click="scoreDetailModal = false">
              Đóng
            </base-button>
          </template>
        </card>
      </modal>
      
      <!-- Delete Confirmation Modal -->
      <modal 
        :show.sync="deleteConfirmModal"
        body-classes="p-0"
        modal-classes="modal-dialog-centered modal-sm"
      >
        <card 
          type="secondary"
          header-classes="bg-white pb-3"
          body-classes="px-lg-5 py-lg-3"
          class="border-0"
        >
          <template slot="header">
            <div class="text-center">
              <h5 class="text-dark">Xác nhận xóa điểm</h5>
            </div>
          </template>
          
          <p class="text-center">Bạn có chắc chắn muốn xóa điểm này không?</p>
          <div class="text-center">
              <base-button type="danger" @click="deleteGrade" class="mr-2">
                Xóa
              </base-button>
              <base-button type="default" @click="deleteConfirmModal = false">
                Hủy
              </base-button>
            </div>
        </card>
      </modal>
    </div>
  </div>
</template>

<script>
import Card from "../../components/Cards/Card.vue";
import BaseTable from '../../components/BaseTable.vue';
import axios from "../../services/axios";
import Modal from '../../components/Modal.vue';

let API_URL = "";

export default {
  components: { Card, BaseTable, Modal },
  mounted() {
    this.initializeData();
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
  computed: {
    isNewGradeValid() {
      return this.newGrade.date_assigned && 
             this.newGrade.grade_type && 
             this.newGrade.score !== null && 
             this.newGrade.score !== "";
    }
  },
  data() {
    return {
      score_columns: ["id", "name", "scores", "action"],
      
      students: [],
      scoreDetail: null,
      scoreDetailModal: false,
      
      editingGrade: null,
      deleteConfirmModal: false,
      gradeToDelete: null,
      
      newGrade: {
        score: "",
        grade_type: 1,
        date_assigned: new Date().toISOString().substr(0, 10)
      },
      
      userData: null
    };
  },
  methods: {
    async initializeData() {
      try {
        await this.getApiUrl();
        await this.getUserData();
        await this.getStudents();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    },
    
    getUserData() {
      this.userData = JSON.parse(localStorage.getItem('user_data'));
    },
    
    getApiUrl() {
      return new Promise((resolve) => {
        API_URL = this.$t("dashboard.apiURL");
        resolve();
      });
    },
    
    getStudents() {
      const token = localStorage.getItem("access_token");
      
      axios
        .get(API_URL + `/users/students/?rooms=${this.roomCode.room_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.students = response.data;
          // After getting students, get their scores
          this.getAllStudentsScores();
        })
        .catch((error) => {
          console.error("Error get student data:", error);
          this.$notify({
            type: "warning",
            icon: 'tim-icons icon-bell-55',
            message: "Lấy danh sách học sinh thất bại",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        });
    },
    
    getAllStudentsScores() {
      const token = localStorage.getItem("access_token");
      
      axios
        .get(API_URL + `/academic_results/grades/?semester=${this.semester.semester}&subject_code=${this.roomCode.subject_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const scores = response.data;
          
          // Group scores by student
          const studentScores = {};
          scores.forEach(score => {
            if (!studentScores[score.student]) {
              studentScores[score.student] = [];
            }
            studentScores[score.student].push(score);
          });
          
          // Add scores to students
          this.students = this.students.map(student => {
            return {
              ...student,
              scores: studentScores[student.account] || []
            };
          });
        })
        .catch((error) => {
          console.error("Error getting all scores:", error);
          this.$notify({
            type: "warning",
            icon: 'tim-icons icon-bell-55',
            message: "Lấy điểm học sinh thất bại",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        });
    },
    
    formatScores(scores) {
      if (!scores || scores.length === 0) return "Chưa có điểm";
      
      // Group by grade type
      const scoresByType = {
        1: [], // Kiểm tra thường xuyên
        2: [], // Kiểm tra giữa kỳ
        3: []  // Kiểm tra cuối kỳ
      };
      
      scores.forEach(score => {
        if (scoresByType[score.grade_type]) {
          scoresByType[score.grade_type].push(score.score);
        }
      });
      
      const result = [];
      
      if (scoresByType[1].length > 0) {
        result.push(`TX: ${scoresByType[1].join(', ')}`);
      }
      
      if (scoresByType[2].length > 0) {
        result.push(`GK: ${scoresByType[2].join(', ')}`);
      }
      
      if (scoresByType[3].length > 0) {
        result.push(`CK: ${scoresByType[3].join(', ')}`);
      }
      
      return result.join(' | ');
    },
    
    toggleDetailScore(student) {
      this.getScoreByStudent(student.account, student);
    },
    
    getScoreByStudent(studentId, student) {
      const token = localStorage.getItem("access_token");
      
      axios
        .get(API_URL + `/academic_results/grades/?student_id=${studentId}&semester=${this.semester.semester}&subject_code=${this.roomCode.subject_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.scoreDetail = {
            student_id: studentId,
            full_name: student.full_name,
            grades: response.data
          };
          this.scoreDetailModal = true;
        })
        .catch((error) => {
          console.error("Error getting student score data:", error);
          this.$notify({
            type: "warning",
            icon: 'tim-icons icon-bell-55',
            message: "Lấy chi tiết điểm học sinh thất bại",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        });
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
    
    getGradeTypeName(type) {
      const types = {
        1: 'Kiểm tra thường xuyên',
        2: 'Kiểm tra thường xuyên',
        3: 'Kiểm tra thường xuyên'
      };
      return types[type] || 'Không xác định';
    },
    
    startEditGrade(grade) {
      // Clone to avoid direct modification
      this.editingGrade = { ...grade };
    },
    
    cancelEdit() {
      this.editingGrade = null;
    },
    
    saveEditGrade() {
      const token = localStorage.getItem("access_token");
      
      axios
        .put(API_URL + `/academic_results/grades/${this.editingGrade.id}/`, this.editingGrade, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.$notify({
            type: "success",
            icon: 'tim-icons icon-bell-55',
            message: "Cập nhật điểm thành công",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
          
          // Update local data
          const index = this.scoreDetail.grades.findIndex(g => g.id === this.editingGrade.id);
          if (index !== -1) {
            this.scoreDetail.grades[index] = { ...this.editingGrade };
          }
          
          this.editingGrade = null;
          this.refreshScores();
        })
        .catch((error) => {
          console.error("Error updating grade:", error);
          this.$notify({
            type: "danger",
            icon: 'tim-icons icon-bell-55',
            message: "Cập nhật điểm thất bại",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        });
    },
    
    confirmDeleteGrade(grade) {
      this.gradeToDelete = grade;
      this.deleteConfirmModal = true;
    },
    
    deleteGrade() {
      const token = localStorage.getItem("access_token");
      
      axios
        .delete(API_URL + `/academic_results/grades/${this.gradeToDelete.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          this.$notify({
            type: "success",
            icon: 'tim-icons icon-bell-55',
            message: "Xóa điểm thành công",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
          
          // Remove from local data
          this.scoreDetail.grades = this.scoreDetail.grades.filter(g => g.id !== this.gradeToDelete.id);
          this.deleteConfirmModal = false;
          this.refreshScores();
        })
        .catch((error) => {
          console.error("Error deleting grade:", error);
          this.$notify({
            type: "danger",
            icon: 'tim-icons icon-bell-55',
            message: "Xóa điểm thất bại",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
          this.deleteConfirmModal = false;
        });
    },
    
    addNewGrade() {
      const token = localStorage.getItem("access_token");
      
      const gradeData = {
        student: this.scoreDetail.student_id,
        subject: this.roomCode.subject_code,
        semester: this.semester.semester,
        score: parseFloat(this.newGrade.score),
        grade_type: parseInt(this.newGrade.grade_type),
        date_assigned: this.newGrade.date_assigned
      };
      
      axios
        .post(API_URL + `/academic_results/grades/`, gradeData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.$notify({
            type: "success",
            icon: 'tim-icons icon-bell-55',
            message: "Thêm điểm thành công",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
          
          // Add to local data
          this.scoreDetail.grades.push(response.data);
          
          // Reset new grade form
          this.newGrade = {
            score: "",
            grade_type: 1,
            date_assigned: new Date().toISOString().substr(0, 10)
          };
          
          this.refreshScores();
        })
        .catch((error) => {
          console.error("Error adding new grade:", error);
          this.$notify({
            type: "danger",
            icon: 'tim-icons icon-bell-55',
            message: "Thêm điểm thất bại",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        });
    },
    
    refreshScores() {
      // If we're viewing a student's details, refresh that student's data
      // if (this.scoreDetail) {
      //   this.getScoreByStudent(this.scoreDetail.student_id, {
      //     account: this.scoreDetail.student_id,
      //     full_name: this.scoreDetail.full_name
      //   });
      // }
      
      // Refresh all students' scores
      this.getAllStudentsScores();
    }
  }
};
</script>

<style>
.form-control {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.table th {
  font-weight: 600;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>