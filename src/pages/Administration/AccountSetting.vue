<template>
  <div class="row">
    <div class="col-12">
      <card>
        <template slot="header">
          <h3>Quản trị tài khoản</h3>
          <div class="col-sm-12">
            <div
              class="btn-group btn-group-toggle float-right"
              data-toggle="buttons"
            >
              <label
                v-for="(option, index) in accountSettingOption"
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
        </template>

        <!-- ĐỔI MẬT KHẨU -->
        <div v-if="bigLineChart.activeIndex === 1">
          <h4 class="title text-dark">
            Reset mật khẩu
          </h4>
          <div class="row">
            <div class="col-md-6 pr-md-1">
              <base-input
                label="ID Người dùng"
                v-model="id_user_reset"
                placeholder="ID"
              >
              </base-input>
            </div>
          </div>

          <base-button @click="resetPassword" type="success" fill
            >Xác nhận</base-button
          >
        </div>

        <!-- ĐĂNG KÝ TÀI KHOẢN -->
        <div v-if="bigLineChart.activeIndex === 0">
          <h4 class="title text-dark">Đăng ký tài khoản</h4>

          <!-- Choose registration type -->
          <div class="row">
            <div class="col-md-6 pr-md-1">
              <label for="registrationType">Loại đăng ký</label>
              <select v-model="registrationType" class="form-control" id="registrationType">
                <option class="text-info" value="teacher">Giáo viên</option>
                <option class="text-info" value="student">Học sinh</option>
                <option class="text-info" value="admin">Admin</option>
              </select>
            </div>
          </div>

          <!-- Hidden File Input -->
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            style="display: none"
          />

          <!-- Button to Upload File -->
          <div class="row mt-4">
            <div class="col-md-6 pr-md-1">
              <base-button type="success" @click="triggerFileUpload" simple>
              <i class="tim-icons icon-attach-87"></i> Upload file Excel
              </base-button>
              <p v-if="selectedFile">{{ selectedFile.name }}</p>
            </div>
            <!-- <section>
            <xlsx-read :file="selectedFile">
                            <xlsx-sheets>
                              <template #default="{sheets}">
                                <base-input label="Sheet">
                                  <select class="form-control" v-model="selectedSheet"> 
                                    <option class="text-info" v-for="sheet in sheets" :key="sheet" :value="sheet">
                                      {{ sheet }}
                                    </option>
                                  </select>
                                </base-input>
                              </template>
                            </xlsx-sheets>
                            <xlsx-table :sheet="selectedSheet" />
                            <xlsx-json :sheet="selectedSheet" :startRow="6">
                              <template #default="{collection}">
                                <div>
                                  {{ collection }}
                                  <base-button v-if="selectedSheet" type="success" @click="updateFilteredCollection(collection)" simple>
                                    <i class="tim-icons icon-simple-add"></i> Thêm lớp học
                                  </base-button>
                                </div>
                              </template>
                            </xlsx-json>
                          </xlsx-read>
            </section> -->
          </div>
          <base-button v-if="selectedFile" :loading="inProgress" @click="registerAccountsTest" type="success" fill >Xác nhận</base-button>  
          
          <div v-if="inProgress">
            <b-progress :value="value" :max="max" show-progress animated variant="success"></b-progress>
          </div>
          <div>
            <!-- <input type="file" @change="handleFileUpload1" /> -->
            <div v-if="tableSuccess.length">
              <h3>Các tài khoản {{changeRoleName(registrationType)}} đã được thêm : </h3>
              <table>
                <thead>
                  <tr>
                    <th v-for="(header, index) in tableHeaders" :key="index">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in tableSuccess" :key="rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          

        </div>
      </card>
    </div>
  </div>
</template>

<script>
import axios from "../../services/axios";
// const API_URL = 'https://classroom50.online';
// const API_URL = "http://127.0.0.1:8000";
let API_URL = ""

import config from "@/config";
import Card from "../../components/Cards/Card.vue";
import {
  XlsxRead,
  XlsxTable,
  XlsxSheets,
  XlsxJson,
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload
} from "vue-xlsx";

import * as XLSX from "xlsx";

export default {
  components: { Card,
    XlsxRead,
    XlsxTable,
    XlsxSheets,
    XlsxJson,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload
   },
  computed: {
    getApiUrl() {
      API_URL =  this.$t("dashboard.apiURL");
    },
  },
  data() {
    return {
      intervalId: null, // ID của setInterval
      processedCount: 0, // Số lượng account đã xử lý
      tableData: [], // Dữ liệu bảng từ dòng 6 trở đi
      tableSuccess: [],
      tableHeaders: [], // Tiêu đề cột,
      successValue: 0,
      value: 45,
        max: 100,
      inProgress: false,
      selectedSheet: null,
      collection: null,
      sheetName: null,
      sheets: [{ name: "SheetOne", data: [{ c: 2 }] }],
      collection: [{ a: 1, b: 2 }],

      id_user_reset: null,
      registrationType: "teacher", // Default registration type
      selectedFile: null, // For file upload
      selectedSheet: null,
      bigLineChart: {
        allData: [
          [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
          [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
          [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
        ],
        activeIndex: 0,
        index: "Quản trị",
        chartData: {
          datasets: [{}],
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
        },

        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: [],
      },
    };
  },
  computed: {
    accountSettingOption() {
      return this.$t("dashboard.accountSetting");
    },
  },
  methods: {
    async registerAccountsTest() {
      this.tableSuccess = [];
      if (!this.tableData.length) {
        alert("Không có account nào để xử lý.");
        return;
      }
      console.log("sheetName"+this.sheetName)
      if((this.registrationType == "teacher" && this.sheetName != "Danh sách giáo viên") ||
        (this.registrationType == "student" && this.sheetName != "Danh sách học sinh") ||
        (this.registrationType == "admin" && this.sheetName != "Danh sách HT PHT")){
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-bell-55",
          message: "Vui lòng kiểm tra lại Đối tượng đăng ký và định dạng Excel" ,
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "right",
        });
        return;
      }

      this.inProgress = true;
      this.successValue = 0;
      this.value = 0;
      this.max = this.tableData.length;
      this.processedCount = 0;

      // Khởi chạy tiến trình cập nhật progress bar
      this.startProgressUpdate();

      // Xử lý từng account
      for (const account of this.tableData) {
        try {
          await this.processAccount(account);
          this.processedCount++; // Cập nhật số account đã xử lý
        } catch (error) {
          console.error("Lỗi khi xử lý account:", error);
        }
      }

      // Dừng tiến trình khi hoàn thành
      this.stopProgressUpdate();
      this.$notify({
            type: "success",
            icon: 'tim-icons icon-check-2',
            message: "Số tài khoản mới được thêm : "+this.successValue,
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
    },
    convertDate(dateStr) {
      // Kiểm tra nếu chuỗi ngày tháng rỗng hoặc không hợp lệ
      if (!dateStr || !/\d{2}\/\d{2}\/\d{4}/.test(dateStr)) {
        return "Invalid date format. Please use dd/mm/yyyy.";
      }

      // Tách ngày, tháng, năm từ chuỗi
      const [day, month, year] = dateStr.split("/");

      // Trả về định dạng yyyy-mm-dd
      return `${year}-${month}-${day}`;
    },

    async processAccount(account) {
      try {
        let apiUrl = API_URL + "/users/register/";
        let data = {};
        if (this.registrationType === "student") {
          data = {
            user_id: account[2],
            username: account[2],
            role: this.registrationType,
            full_name: account[3],
            sex: account[5],
            day_of_birth: this.convertDate(account[4]),
            nation: account[6],
            active_status: account[7]
          };
        } else if (this.registrationType === "teacher") {
          data = {
            user_id: account[1],
            username: account[1],
            phone_number: account[7],
            role: this.registrationType,
            full_name: account[2],
            sex: account[4],
            day_of_birth: this.convertDate(account[3]),
            nation: account[6],
            active_status: account[5],
            contract_types: account[10],
            expertise_levels: account[11],
            subjects: account[12],
          };
        } else if (this.registrationType === "admin") {
          data = {
              user_id: account[1],
              username: account[1],
              phone_number: account[7],
              role: this.registrationType,
              full_name: account[2],
              sex: account[4],
              day_of_birth: this.convertDate(account[3]),
              nation: account[6],
              active_status: account[5],
              contract_types: account[10],
              expertise_levels: account[11],
              description: "QLHT"
          };
        }

        const token = localStorage.getItem("access_token");

        const response = await axios.post(apiUrl, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        this.successValue++;
        this.tableSuccess.push(account);
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: response.data.detail,
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "right",
        });

        return true; // Xử lý thành công
      } catch (error) {
        console.error("Error registering accounts:", error);

        // const errorMessage =
        //   error.response?.data ||
        //   "Có lỗi xảy ra. Vui lòng thử lại sau";
        // this.$notify({
        //   type: "danger",
        //   icon: "tim-icons icon-bell-55",
        //   message: errorMessage,
        //   timeout: 3000,
        //   verticalAlign: "top",
        //   horizontalAlign: "right",
        // });

        return false; // Xử lý thất bại
      }
    },

    startProgressUpdate() {
      // Khởi tạo setInterval để cập nhật progress bar mỗi 0,5 giây
      this.intervalId = setInterval(() => {
        this.value = this.processedCount; // Cập nhật giá trị dựa trên số account đã xử lý
      }, 500);
    },

    stopProgressUpdate() {
      // Dừng setInterval và đặt lại trạng thái
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.inProgress = false;
    },
    handleFileUpload1(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Chọn sheet đầu tiên
        const sheet = workbook.Sheets[sheetName];

        // Chuyển đổi dữ liệu sheet sang JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("Full data:", jsonData);

        // Lấy tiêu đề cột từ dòng 5
        this.tableHeaders = jsonData[4];

        // Lấy dữ liệu từ dòng 7 trở đi
        this.tableData = jsonData.slice(6);
        console.log("Filtered data:", this.tableData);
      };
      reader.readAsArrayBuffer(file);
    },
    updateFilteredCollection(collection) {
    // Bỏ qua 5 dòng đầu tiên (index từ 0 đến 4)
    const filteredCollection = collection.slice(5);
    console.log("Filtered Data:", filteredCollection);
    // Tiếp tục xử lý dữ liệu sau khi lọc
    this.updateCollection(filteredCollection);
  },
    updateCollection(newCollection) {
      this.collection = newCollection; // Lưu collection vào this.collection
    },
    toggleProgress(){
      this.inProgress = true;
    },
    changeRoleName(role){
      if(role == "teacher") return "giáo viên"
      if(role == "student") return "học sinh"
      if(role == "admin") return "admin"
      return "";
    },
    randomValue() {
        this.value = Math.random() * this.max
      }
    ,
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
            data: this.bigLineChart.allData[index],
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
      if (index === 0) this.bigLineChart.index = "Reset password";
      if (index === 1) this.bigLineChart.index = "Option2";
      if (index === 2) this.bigLineChart.index = "Option3";
    },
    resetPassword() {
      const token = localStorage.getItem("access_token");
      const resetPasswordData = {
        user_id: this.id_user_reset,
      };

      axios
        .post(API_URL + "/users/reset-password/", resetPasswordData, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.$notify({
            type: "success",
            icon: 'tim-icons icon-check-2',
            message: response.data.message,
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
          this.isEditingResetPassword = false; // Tắt chế độ chỉnh sửa

          this.user_id_reset = null;
        })
        .catch((error) => {
          console.error("Error reset password user :", error);

          // this.isEditingPassword = false; // Tắt chế độ chỉnh sửa
          if (error.response && error.response.data) {
            if (error.response.status === 401) {
              this.$notify({
                type: "danger",
                icon: 'tim-icons icon-alert-circle-exc',
                message: "Bạn không có quyền thực hiện thao tác này.",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
            }
            if (error.response.status === 404) {
              this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Người dụng không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
            }
          } else {
            this.$notify({
              type: "danger",
              icon: 'tim-icons icon-bell-55',
              message: "Reset mật khẩu không thành công. Vui lòng thử lại sau.",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          }
        });
    },
    triggerFileUpload() {
      this.$refs.fileInput.click(); // Trigger file input click event
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0]; // Get selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        this.sheetName = workbook.SheetNames[0]; // Chọn sheet đầu tiên
        const sheet = workbook.Sheets[this.sheetName];

        // Chuyển đổi dữ liệu sheet sang JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("Full data:", jsonData);

        // Lấy tiêu đề cột từ dòng 5
        this.tableHeaders = jsonData[4];

        // Lấy dữ liệu từ dòng 7 trở đi
        this.tableData = jsonData.slice(6);
        console.log("Filtered data:", this.tableData);
      };
      reader.readAsArrayBuffer(this.selectedFile);
    },

    registerAccounts() {
      if (!this.selectedFile) {
        this.$notify({
          type: "warning",
          icon: 'tim-icons icon-bell-55',
          message: "Vui lòng tải lên tệp Excel",
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "center",
        });
        return;
      }
      this.toggleProgress();
      const formData = new FormData();
      formData.append("file", this.selectedFile);

      let apiUrl = "";
      if (this.registrationType === "student") {
        apiUrl = API_URL + "/accounts/register-student/";
      } else if (this.registrationType === "teacher") {
        apiUrl = API_URL + "/accounts/register-teacher/";
      } else if (this.registrationType === "parent") {
        apiUrl = API_URL + "/accounts/register-parent/";
      }

      const token = localStorage.getItem("access_token");

      axios
        .post(apiUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 100000,
        })
        .then((response) => {
          this.$notify({
            type: "success",
            icon: 'tim-icons icon-check-2',
            message: response.data.detail,
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        })
        .catch((error) => {
          console.error("Error registering accounts:", error);
          if (error.response) {
            if (error.response && error.response.data) {
          // Kiểm tra lỗi validate_file từ backend
          if (error.response.data.file) {
            const errorMessage = error.response.data.file[0]; // Lấy thông báo lỗi từ trường file
            this.$notify({
              type: "danger",
              icon: 'tim-icons icon-bell-55',
              message: errorMessage,
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          } else {
            const errorMessage = "Vui lòng kiểm tra lại cấu trúc file và loại đối tượng đăng ký ";
            console.error("Error registering accounts:", error);
            this.$notify({
              type: "danger",
              icon: 'tim-icons icon-bell-55',
              message: error.response.data,
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          }
        } else {
          // Thông báo lỗi nếu không nhận được phản hồi cụ thể từ backend
          this.$notify({
            type: "danger",
            icon: 'tim-icons icon-alert-circle-exc',
            message: "Lỗi không xác định. Vui lòng thử lại.",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        }
          } else {
            this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Có lỗi xảy ra. Vui lòng thử lại sau",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          }
        });
    },
  },
};
</script>

<style>
</style>