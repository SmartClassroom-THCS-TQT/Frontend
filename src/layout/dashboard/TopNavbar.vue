<template>
<div>
  <nav
    class="navbar navbar-expand-lg navbar-absolute"
    :class="{ 'bg-white': showMenu, 'navbar-transparent': !showMenu }"
  >
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div
          class="navbar-toggle d-inline"
          :class="{ toggled: $sidebar.showSidebar }"
        >
          <button
            type="button"
            class="navbar-toggler"
            aria-label="Navbar toggle button"
            @click="toggleSidebar"
          >
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <a class="navbar-brand" style="color: #3e413c; font-weight: bold;" href="#pablo">{{ routeName }}</a>
      </div>
      

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        data-toggle="collapse"
        data-target="#navigation"
        aria-controls="navigation-index"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
            <!-- <div
              class="search-bar input-group"
              @click="searchModalVisible = true"
            >
              <button
                class="btn btn-link"
                id="search-button"
                data-toggle="modal"
                data-target="#searchModal"
              >
                <i class="tim-icons icon-zoom-split"></i>
              </button> -->
              <base-button @click="studyToggle" type="simple" simple class="text-center ml-2" v-if="userRole === 'teacher'" >
               <i class="tim-icons icon-atom"></i> Dạy học
              </base-button>
              
              
              <!-- You can choose types of search input -->
            <base-dropdown
              tag="li"
              :menu-on-right="!$rtl.isRTL"
              title-tag="a"
              class="nav-item"
              menu-classes="dropdown-navbar"
            >
              <a
                slot="title"
                href="#"
                class="dropdown-toggle nav-link"
                data-toggle="dropdown"
                aria-expanded="true"
              >
                <div class="photo mr-3">
                  <img src="img/anime3.png" />
                </div>
                <span v-if="userData" :userData="userData" class="mr-5" style="color: black;">{{ userData.full_name }}</span>
                <span class="caret d-none d-lg-block d-xl-block" style="color: #3e413c;"> </span>
                <p v-if="userData" :userData="userData" class="d-lg-none">{{ userData.full_name }}</p>
              </a>
              <li class="nav-link">
                
                <router-link :to="{ path: 'profile'}">
                  <a href="#" class="nav-item dropdown-item">Thông tin tài khoản</a>
                </router-link>
              </li>
              <div class="dropdown-divider"></div>
              <li class="nav-link">
                <a @click="logout" href="#" class="nav-item dropdown-item">Đăng xuất</a>
              </li>
            </base-dropdown>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </nav>
  <Loading :loading="isLoading" />
  </div>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import Modal from "@/components/Modal";
import axios from '../../services/axios'; 
import Loading from '../loading/Loading.vue';

import BaseButton from '../../components/BaseButton.vue';
 
let API_URL = ""

export default {
  props: {
    userData: {
      type: Object,
      required: true,
      default: "User",
    }
  },
  components: {
    CollapseTransition,
    Modal,
    BaseButton,
    Loading
  },
  mounted(){
    this.userRole = localStorage.getItem('user_role');
    this.fetchPeriods(); // Fetch periods when component is mounted
  },
  computed: {
    getApiUrl() {
      API_URL =  this.$t("dashboard.apiURL");
    },
    routeName() {
      const name = this.$route.matched[1].name;
      return name || "";
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
      isLoading: false,
      userRole: null,
      periods: [], // Add periods array to store fetched periods
    };
  },
  methods: {
    async fetchPeriods() {
      try {
        const response = await axios.get(API_URL + '/managements/time-slots/');
        this.periods = response.data;
      } catch (error) {
        console.error('Error fetching periods:', error);
        this.$notify({
          type: 'danger',
          icon: 'tim-icons icon-bell-55',
          message: "Lỗi khi lấy thông tin tiết học",
          timeout: 3000,
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
      }
    },
    getCurrentPeriod() {
      const currentDate = new Date();
      const currentTime = currentDate.toTimeString().slice(0, 8); // Get current time in HH:MM:SS format
      
      for (const period of this.periods) {
        if (currentTime >= period.start_time && currentTime <= period.end_time) {
          return period.code;
        }
      }
      
      return null; // No current period
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    logout() {
      localStorage.removeItem('access_token');  // Xóa token khỏi localStorage
      // localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      this.$notify({
          type: 'warning',
          icon: 'tim-icons icon-bell-55',
          message: "Bạn đã đăng xuất",
          timeout: 3000,
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
      this.$router.push('/login');  // Điều hướng về trang đăng nhập
      
    },
    getCurrentFormattedDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
      const day = String(date.getDate()).padStart(2, '0');        // Đảm bảo luôn có 2 chữ số

      return `${year}-${month}-${day}`;
    },
    async studyToggle(){
      const user_role = localStorage.getItem('user_role');
      if (user_role !== 'teacher') {
        this.$notify({
          type: 'warning',
          icon: 'tim-icons icon-bell-55',
          message: "Bạn không có quyền vào mục này.",
          timeout: 1000,
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
        return
      }

      const currentDate = new Date();
      const currentPeriod = this.getCurrentPeriod();

      if (currentPeriod === null) {
        this.$notify({
          type: 'warning',
          icon: 'tim-icons icon-bell-55',
          message: "Hiện tại không có tiết học nào.",
          timeout: 1000,
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.get(API_URL + `/managements/sessions/?teacher=${this.userData.account}&day=${this.getCurrentFormattedDate(currentDate)}&time_slot_code=${currentPeriod}`, {
          
        })
        console.log(response.data[0])
          if (response.data.length !== 0) {
            
            localStorage.setItem('lesson_data', JSON.stringify(response.data[0]));
            this.$notify({
              type: 'success',
              icon: 'tim-icons icon-bell-55',
              message: "Bắt đầu dạy học lớp "+response.data[0].room_id.name,
              timeout: 1000,
              verticalAlign: 'top',
              horizontalAlign: 'center',
            });
            this.$router.push('/study');
        } else {
          this.$notify({
            type: 'warning',
            icon: 'tim-icons icon-bell-55',
            message: "Hiện tại bạn không có tiết học.",
            timeout: 1000,
            verticalAlign: 'top',
            horizontalAlign: 'center',
          });
        }
      }
      catch(error) {
        this.$notify({
          type: 'danger',
          icon: 'tim-icons icon-bell-55',
          message: "Lỗi khi kiểm tra tiết học: ",
          timeout: 1000,
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
      }
      finally {
        this.isLoading = false;  // Kết thúc loading
      }
    },
  },
};
</script>
<style>
/* .centered-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50%;
  transform: translate(-50%, -50%);
} */
 .btn-demo {
  padding: 10px 20px;
}

.search-bar .btn-demo {
  margin-left: 10px; /* Khoảng cách giữa icon tìm kiếm và nút Dạy học */
}
</style>
