<template>
  <card type="user">
    <p class="card-text"></p>
    <div class="author">
      <div class="block block-one"></div>
      <div class="block block-two"></div>
      <div class="block block-three"></div>
      <div class="block block-four"></div>
      <a href="#">
        <!-- <img class="avatar"  src="img/anime6.png" alt="..."  /> -->
        <img class="avatar" :src="user.image ? user.image : defaultImage" 
          alt="Ảnh đại diện" 
          @click="updateAvatar"/>
        
      </a>
      <h5 class="title" style="color:#3e413c">{{ user.fullName }}</h5>
      <p class="description" style="color: #3e413c;">
        {{ user.title }}
      </p>
    </div>
    <p></p>
    <div slot="footer" class="button-container">
      <base-button icon round class="btn-facebook">
        <i class="fab fa-facebook"></i>
      </base-button>
      <base-button icon round class="btn-twitter">
        <i class="fab fa-twitter"></i>
      </base-button>
      <base-button icon round class="btn-google">
        <i class="fab fa-google-plus"></i>
      </base-button>
    </div>

    <!-- Input file ẩn -->
     <input 
      ref="fileInput" 
      type="file" 
      accept="image/*" 
      style="display: none;" 
      @change="handleFileChange" 
    />
  </card>
</template>
<script>
import axios from "../../services/axios";
let BASE_URL = ""
let API_URL = ""
export default {
  data() {
    return {
      defaultImage: require('@/assets/img/icon_sm2.jpg'),
      BASE_URL: this.$t("dashboard.baseURL"),
      user_role: null,
    }
  },
  mounted() {
    this.getUserRole()
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    getApiUrl() {
      BASE_URL =  this.$t("dashboard.baseURL");
      API_URL = this.$t("dashboard.apiURL");
    },
  },
  methods: {
    getUserRole(){
      this.user_role = localStorage.getItem("user_role");
    },
    // Mở cửa sổ chọn tệp
    updateAvatar() {
      this.$refs.fileInput.click(); // Kích hoạt input file
    },
    // Xử lý file ảnh sau khi chọn
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        // Gửi API để cập nhật ảnh đại diện
        this.updateUserProfile(formData);
      }
    },
    async updateUserProfile(formData) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.patch( API_URL + `users/${this.user_role}s/${this.model.user_id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        this.$notify({
            type: "success",
            icon: 'tim-icons icon-check-2',
            message: "Cập nhật ảnh đại diện thành công",
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
        
        // Reload lại trang để đảm bảo dữ liệu mới được hiển thị
        window.location.reload();
      } catch (error) {
        console.error('Lỗi khi cập nhật ảnh đại diện:', error);
        alert('Có lỗi xảy ra khi cập nhật ảnh đại diện!');
      }
    }

  },
};
</script>
<style></style>
