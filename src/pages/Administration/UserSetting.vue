<template>
  <div class="row">
    <div class="col-12">
      <card>
        <template slot="header">
          <div class="col-sm-12">
            <div
              class="btn-group btn-group-toggle float-right"
              data-toggle="buttons"
            >
              <label
                v-for="(option, index) in userSettingOption"
                :key="option"
                class="btn btn-sm btn-neutral btn-simple"
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

        <!-- HỌC SINH -->
        <!-- <div v-if="bigLineChart.activeIndex === 0" class="card-container">

          <div
            v-for="(room, index) in roomData"
            :key="index"
            class="card-item"
          >
            <card class="text-center" style="width: 10rem;">
              <h4 class="card-title text-dark">{{ room.name }}</h4>
              <base-button type="info" size="sm" icon @click="toggleRoomDetail(room)">
                <i class="tim-icons icon-single-02"></i>
              </base-button>
              <base-button type="danger" size="sm" icon @click="toggleRemoveRoom(room.code)">
                <i class="tim-icons icon-simple-remove"></i>
              </base-button>
            </card>
          </div>


          <div class="card-item add-card">
            <card class="text-center" style="width: 10rem;">
              <h4 class="card-title">Thêm lớp</h4>
              <base-button type="info" size="lg" class="btn-simple" icon @click="toggleRemoveCreate()">
                <i class="tim-icons icon-simple-add"></i>
              </base-button>
            </card>
          </div>
        </div>

        <modal :show.sync="modals.roomCreateModal" 
              body-classes="p-0"
              modal-classes="modal-dialog-centered modal-lg">
            
            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-success">Thêm lớp học</h4>
                    </div>
                </template>
                <template>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Mã lớp học" v-model="modals.roomCreate.code"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Tên lớp học" v-model="modals.roomCreate.name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Giáo viên chủ nhiệm">
                                          <select v-model="modals.roomCreate.manager" class="form-control">
                                            <option class="text-info" v-for="(teacher, index) in teacherData" :key="index" :value="teacher.user_id">{{ teacher.full_name + " - " + teacher.user_id }}</option>
                                          </select>
                                        </base-input>
                                    </div>
                                </div>
                                
                                <base-button @click="addRoom" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>
        </modal>


        <modal :show.sync="modals.roomDetailModal"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="modals.roomDetail">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Chi tiết lớp học {{modals.roomDetail.name}}</h4>
                        <p class="text-info">Giáo viên chủ nhiệm : {{modals.roomDetail.manager}}</p>
                    </div>
                </template>
                <template>
                    <base-table :data="studentData" :columns="student_columns">
                    <template slot="columns">
                      <th>ID</th>
                      <th>Học sinh</th>
                      <th>Giới tính</th>
                      <th>Ngày sinh</th>
                      <th>Tình trạng</th>
                      <th class="text-right">Actions</th>
                    </template>
                    <template slot-scope="{ row }">
                      <td>{{ row.account }}</td>
                      <td>{{ row.full_name }}</td>
                      <td>{{ row.sex }}</td>
                      <td>{{ row.day_of_birth }}</td>
                      <td>{{ row.active_status }}</td>
                      <td class="td-actions text-right">
                        <base-button type="info" size="sm" icon @click="toggleDetail(row.account)">
                          <i class="tim-icons icon-single-02"></i>
                        </base-button>
                        <base-button type="success" size="sm" icon @click="toggleUpdate(row.account)">
                          <i class="tim-icons icon-settings"></i>
                        </base-button>
                        <base-button type="danger" size="sm" icon @click="toggleRemove(row.account)">
                          <i class="tim-icons icon-simple-remove"></i>
                        </base-button>
                      </td>
                    </template>
                  </base-table>
                </template>
                
                <template>
                  <section>
                        <p class="text-info text-center">
                          Cập nhật danh sách học sinh bằng cách upload file excel theo định dạng :  
                          <a @click="downloadExcel" style="cursor: pointer; text-decoration: underline;">
                            Tải xuống
                          </a>
                        </p>

                        <xlsx-workbook>
                          <xlsx-sheet
                            :collection="sheet.data"
                            v-for="sheet in sheets"
                            :key="sheet.name"
                            :sheet-name="sheet.name"
                          />
                          <xlsx-download ref="excelDownload">
                            <a ref="downloadLink" style="display: none;">Download</a>
                          </xlsx-download>
                        </xlsx-workbook>
                  </section>
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    style="display: none"
                  />
                  <base-button type="" @click="triggerFileUpload" simple>
                    <i class="tim-icons icon-attach-87"></i> Upload file Excel
                  </base-button>
                  <base-button v-if="selectedFile" :loading="inProgress" @click="registerAccountsTest" type="success" fill >Cập nhật danh sách học sinh</base-button>
                  <p v-if="selectedFile" class="text-info">{{ selectedFile.name }}</p>     

                  <div v-if="inProgress">
                    <b-progress :value="value" :max="max" show-progress animated variant="success"></b-progress>
                  </div>             
                </template>
            </card>
        </modal> -->
        <div v-if="bigLineChart.activeIndex === 0">
          <base-table :data="studentData" :columns="student_columns">
            <template slot="columns">
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Lớp</th>
              <th>Trạng thái</th>
              <th class="text-right">Actions</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.account }}</td>
              <td>{{ row.full_name }}</td>
              <td>{{ row.sex }}</td>
              <td>{{ row.day_of_birth }}</td>
              <td>{{ row.rooms}}</td>
              <td>{{ row.active_status }}</td>
              <td class="td-actions text-right">
                <base-button type="info" size="sm" icon @click="toggleDetail(row.user_id)">
                  <i class="tim-icons icon-single-02"></i>
                </base-button>
                <base-button type="success" size="sm" icon @click="toggleUpdate(row.user_id)">
                  <i class="tim-icons icon-settings"></i>
                </base-button>
                <base-button type="danger" size="sm" icon @click="toggleRemove(row.user_id)">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </td>
            </template>
          </base-table>
        </div>
        
        
        <!-- GIÁO VIÊN -->
        <div v-if="bigLineChart.activeIndex === 1">
          <base-table :data="teacherData" :columns="teacher_columns">
            <template slot="columns">
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Môn dạy</th>
              <th class="text-right">Actions</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.account }}</td>
              <td>{{ row.full_name }}</td>
              <td>{{ row.sex }}</td>
              <td>{{ row.day_of_birth }}</td>
              <td>{{ row.subjects }}</td>
              <td class="td-actions text-right">
                <base-button type="info" size="sm" icon @click="toggleDetail(row.user_id)">
                  <i class="tim-icons icon-single-02"></i>
                </base-button>
                <base-button type="success" size="sm" icon @click="toggleUpdate(row.user_id)">
                  <i class="tim-icons icon-settings"></i>
                </base-button>
                <base-button type="danger" size="sm" icon @click="toggleRemove(row.user_id)">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </td>
            </template>
          </base-table>
        </div>

        <!-- PHỤ HUYNH -->
        <!-- <div v-if="bigLineChart.activeIndex === 2">
          <base-table :data="parentData" :columns="parent_columns">
            <template slot="columns">
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Địa chỉ</th>
              <th class="text-right">Actions</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.user }}</td>
              <td>{{ row.full_name }}</td>
              <td>{{ row.address }}</td>
              <td class="td-actions text-right">
                <base-button type="info" size="sm" icon @click="toggleDetail(row.user)">
                  <i class="tim-icons icon-single-02"></i>
                </base-button>
                <base-button type="success" size="sm" icon @click="toggleUpdate(row.user)">
                  <i class="tim-icons icon-settings"></i>
                </base-button>
                <base-button type="danger" size="sm" icon @click="toggleRemove(row.user)">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </td>
            </template>
          </base-table>
        </div> -->

        <!-- ADMIN -->
        <div v-if="bigLineChart.activeIndex === 2">
          <base-table :data="adminData" :columns="admin_columns">
            <template slot="columns">
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Chức vụ</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.account }}</td>
              <td>{{ row.full_name }}</td>
              <td>{{ row.sex }}</td>
              <td>{{ row.day_of_birth }}</td>
              <td>{{ row.description }}</td>
            </template>
          </base-table>
        </div>

        <!-- Detail Modal -->
        <modal :show.sync="modals.detailModal"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
               <!-- Học sinh -->
            <card type="user"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 0 && modals.studentDetail">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Thông tin học sinh</h4>
                    </div>
                    <div class="author">
                          <!-- <img class="avatar"  src="img/anime6.png" alt="..."  /> -->
                          <img class="avatar" :src="modals.studentDetail.image ? `http://127.0.0.1:8000${modals.studentDetail.image}` : defaultImage" 
                            alt="Ảnh đại diện" 
                            />
                    </div> 
                </template>
                <template v-if="modals.studentDetail">
                    <fieldset disabled>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="ID" v-model="modals.studentDetail.user_id"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Họ và tên" v-model="modals.studentDetail.full_name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Lớp" v-model="modals.roomDetail.name"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Giới tính" v-model="modals.studentDetail.sex"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Ngày sinh" v-model="modals.studentDetail.day_of_birth"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Trạng thái" v-model="modals.studentDetail.active_status"></base-input>
                                    </div>
                                </div>
                                <!-- <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Phụ huynh" v-model="modals.studentDetail.parent"></base-input>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </fieldset>  
                </template>
            </card>

            <!-- Giáo viên -->

            <card type="user"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 1 && modals.teacherDetail">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Thông tin giáo viên</h4>
                    </div>
                    <div class="author">
                          <!-- <img class="avatar"  src="img/anime6.png" alt="..."  /> -->
                          <img class="avatar" :src="modals.teacherDetail.image ? `http://127.0.0.1:8000${modals.teacherDetail.image}` : defaultImage" 
                            alt="Ảnh đại diện" 
                            />
                    </div> 
                </template>
                <template v-if="modals.teacherDetail">
                    <fieldset disabled>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="ID" v-model="modals.teacherDetail.user_id"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Họ và tên" v-model="modals.teacherDetail.full_name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Môn dạy" v-model="modals.teacherDetail.teacher.subjects"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Giới tính" v-model="modals.teacherDetail.sex"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Ngày sinh" v-model="modals.teacherDetail.day_of_birth"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Dân tộc" v-model="modals.teacherDetail.nation"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Học vấn" v-model="modals.teacherDetail.teacher.expertise_levels"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Số điện thoại" v-model="modals.teacherDetail.phone_number"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Chức vụ" v-model="modals.teacherDetail.teacher.contract_types"></base-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>  
                </template>
            </card>

            <!-- Phụ huynh -->

            <!-- <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 2">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Thông tin phụ huynh</h4>
                    </div>
                </template>
                <template v-if="modals.parentDetail">
                    <fieldset disabled>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="ID" v-model="modals.parentDetail.user"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Họ và tên" v-model="modals.parentDetail.full_name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Địa chỉ" v-model="modals.parentDetail.address"></base-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>  
                </template>
            </card> -->
        </modal>

        <!-- Update Modal -->
        <modal :show.sync="modals.updateModal"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
            <!-- Học sinh -->
            <card type="user" 
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 0 && modals.studentDetail">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Cập nhật học sinh</h4>
                    </div>
          
                      <div class="author">
                          <!-- <img class="avatar"  src="img/anime6.png" alt="..."  /> -->
                          <img class="avatar" :src="modals.studentDetail.image ? `http://127.0.0.1:8000${modals.studentDetail.image}` : defaultImage" 
                            alt="Ảnh đại diện" 
                            />
                      </div>          
                </template>
                <template v-if="modals.studentDetail">
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input disabled label="ID" v-model="modals.studentDetail.user_id"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Họ và tên" v-model="modals.studentDetail.full_name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input disabled label="Lớp" v-model="modals.roomDetail.name"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Giới tính" >
                                          <select v-model="modals.studentDetail.sex" class="form-control">
                                            <option class="text-info">Nam</option>
                                            <option class="text-info">Nữ</option>
                                            <option class="text-info">Khác</option>
                                          </select>
                                        </base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="date" label="Ngày sinh" v-model="modals.studentDetail.day_of_birth"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Trạng thái" v-model="modals.studentDetail.active_status"></base-input>
                                    </div>
                                </div>
                                <!-- <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Phụ huynh" v-model="modals.studentDetail.parent"></base-input>
                                    </div>
                                </div> -->
                                <base-button @click="updateObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>

            <!-- Giáo viên -->
            <card type="user"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 1 && modals.teacherDetail">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Cập nhật giáo viên</h4>
                    </div>

                    <div class="author">
                          <!-- <img class="avatar"  src="img/anime6.png" alt="..."  /> -->
                          <img class="avatar" :src="modals.teacherDetail.image ? `http://127.0.0.1:8000${modals.teacherDetail.image}` : defaultImage" 
                            alt="Ảnh đại diện" 
                            />
                    </div> 
                </template>
                <template v-if="modals.teacherDetail">
                    <fieldset>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input disabled label="ID" v-model="modals.teacherDetail.user_id"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Họ và tên" v-model="modals.teacherDetail.full_name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Môn dạy" v-model="modals.teacherDetail.teacher.subjects"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                       
                                        <base-input label="Giới tính" >
                                          <select v-model="modals.teacherDetail.sex" class="form-control">
                                            <option class="text-info">Nam</option>
                                            <option class="text-info">Nữ</option>
                                            <option class="text-info">Khác</option>
                                          </select>
                                        </base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="date" label="Ngày sinh" v-model="modals.teacherDetail.day_of_birth"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Dân tộc" v-model="modals.teacherDetail.nation"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Học vấn" v-model="modals.teacherDetail.teacher.expertise_levels"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Số điện thoại" v-model="modals.teacherDetail.phone_number"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Chức vụ" v-model="modals.teacherDetail.teacher.contract_types"></base-input>
                                    </div>
                                </div>
                                <base-button @click="updateObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                    </fieldset>  
                </template>
            </card>

            <!-- Phụ huynh -->
            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 2">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Cập nhật phụ huynh</h4>
                    </div>
                </template>
                <template v-if="modals.parentDetail">
                    <fieldset>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="ID" v-model="modals.parentDetail.user_id"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Họ và tên" v-model="modals.parentDetail.full_name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Địa chỉ" v-model="modals.parentDetail.address"></base-input>
                                    </div>
                                </div>
                                <base-button @click="updateObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                    </fieldset>  
                </template>
            </card>
        </modal>

        <!-- Remove Modal -->
        
        
        <!-- Remove Room Modal -->
        <!-- <modal :show.sync="modals.removeRoomModal">
            <h4 slot="header" class="modal-title" id="modal-title-default" v-if="this.bigLineChart.activeIndex === 0">Xác nhận xóa lớp học này</h4>
            <template slot="footer">
                <base-button type="secondary" @click="removeObject">Xác nhận</base-button>
                <base-button type="danger" class="ml-auto" @click="modals.removeRoomModal = false">Hủy
                </base-button>
            </template>
        </modal> -->
        

      </card>
      <modal :show.sync="modals.removeModal">
            <h4 slot="header" class="modal-title" id="modal-title-default" v-if="this.bigLineChart.activeIndex === 0" >Xác nhận xóa học sinh này</h4>
            <h4 slot="header" class="modal-title" id="modal-title-default" v-if="this.bigLineChart.activeIndex === 1">Xác nhận xóa giáo viên này</h4>
            <h4 slot="header" class="modal-title" id="modal-title-default" v-if="this.bigLineChart.activeIndex === 2">Xác nhận xóa phụ huynh này</h4>
            <template slot="footer">
                <base-button type="secondary" @click="removeObject">Xác nhận</base-button>
                <base-button type="danger" class="ml-auto" @click="modals.removeModal = false">Hủy
                </base-button>
            </template>
        </modal>
    </div>
  </div>
</template>

<script>
import axios from "../../services/axios";

let API_URL = ""

import config from "@/config";
import Card from "../../components/Cards/Card.vue";
import BaseTable from '../../components/BaseTable.vue';
import Modal from '../../components/Modal.vue';
import BaseInput from '../../components/Inputs/BaseInput.vue';

import {
  XlsxRead,
  XlsxTable,
  XlsxSheets,
  XlsxJson,
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload
} from "vue-xlsx";


export default {
  components: { Card, BaseTable, Modal, BaseInput, 
    XlsxRead,
    XlsxTable,
    XlsxSheets,
    XlsxJson,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload },
  computed: {
    getApiUrl() {
      API_URL =  this.$t("dashboard.apiURL");
    },
  },
  data() {
    return {
    successValue: 0,
    intervalId: null,
    tableSuccess: null,
    inProgress: false,
    value: 45,
    max: 100,
    perPage: 3,
    currentPage: 1,
    defaultImage: require('@/assets/img/icon_sm2.jpg'),
    modals: {
        roomDetailModal: false,
        roomCreateModal: false,
        detailModal: false,
        updateModal: false,
        removeModal: false,
        idRemove: null,
        
        roomCreate: {
          code: null,
          name: null,
          manager: null
        },
        removeRoomModal: false,
        teacherModal: false,
        parentModal: false,
        studentDetail: null,
        teacherDetail: null,
        parentDetail: null,
        roomDetail: null,
    },
    student_columns: ["user", "full_name", "sex", "day_of_birth", "rooms", "active_status", "actions"],
    teacher_columns: ["user", "full_name", "sex", "day_of_birth", "subjects", "actions"],
    parent_columns: ["user", "full_name", "address"],
    admin_columns: ["user", "full_name", "sex", "day_of_birth", "description"],
      roomData: null,
      studentData: null,
      teacherData: null,
      parentData: null,
      adminData: null,

      removeRoom: false,

      homeroomTeacherId : null,
      roomCreateName: null,
      allCreateStudent: null,

      //excel
      selectedFile: null,
      file: null,
      selectedSheet: null,
      sheetName: null,
      sheets: [{ name: "Cập nhật học sinh",
         data: [ { "STT": 1, "Thứ tự": "1", "user": "3581635860", "Họ tên": "Nguyễn Trịnh Bảo An", "Ngày sinh": "04/09/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 2, "Thứ tự": "2", "user": "3581635894", "Họ tên": "Cao Danh Hải Anh", "Ngày sinh": "22/05/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 3, "Thứ tự": "3", "user": "3581635904", "Họ tên": "Hà Đặng Nhật Anh", "Ngày sinh": "12/06/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 4, "Thứ tự": "4", "user": "3581635898", "Họ tên": "Đặng Ngọc Doanh", "Ngày sinh": "01/08/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 5, "Thứ tự": "5", "user": "3581635865", "Họ tên": "Phạm Minh Giang", "Ngày sinh": "27/11/2012", "Giới tính": "Nữ", "Dân tộc": "Kinh", "Trạng thái": "Đang học" } ] }],
      collection: null,

      bigLineChart: {
        allData: [
          [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
          [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
          [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
        ],
        activeIndex: null,
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
    userSettingOption() {
      return this.$t("dashboard.userSetting");
    },
  },
  methods: {
    // async registerAccountsTest() {
    //   this.tableSuccess = [];
    //   if (!this.tableData.length) {
    //     alert("Không có account nào để xử lý.");
    //     return;
    //   }
    //   console.log("sheetName"+this.sheetName)
    //   if(this.sheetName != "Cập nhật học sinh"){
    //     this.$notify({
    //       type: "danger",
    //       icon: "tim-icons icon-bell-55",
    //       message: "Vui lòng kiểm tra lại định dạng Excel" ,
    //       timeout: 3000,
    //       verticalAlign: "top",
    //       horizontalAlign: "right",
    //     });
    //     return;
    //   }

    //   this.inProgress = true;
    //   this.successValue = 0;
    //   this.value = 0;
    //   this.max = this.tableData.length;
    //   this.processedCount = 0;

    //   // Khởi chạy tiến trình cập nhật progress bar
    //   this.startProgressUpdate();

    //   // Xử lý từng account
    //   for (const account of this.tableData) {
    //     try {
    //       await this.processAccount(account);
    //       this.processedCount++; // Cập nhật số account đã xử lý
    //     } catch (error) {
    //       console.error("Lỗi khi xử lý account:", error);
    //     }
    //   }

    //   // Dừng tiến trình khi hoàn thành
    //   this.stopProgressUpdate();
    //   this.$notify({
    //         type: "success",
    //         icon: 'tim-icons icon-check-2',
    //         message: "Số học sinh mới được thêm vào lớp : "+this.successValue,
    //         timeout: 3000,
    //         verticalAlign: "top",
    //         horizontalAlign: "right",
    //       });
    // },
    // startProgressUpdate() {
    //   // Khởi tạo setInterval để cập nhật progress bar mỗi 0,5 giây
    //   this.intervalId = setInterval(() => {
    //     this.value = this.processedCount; // Cập nhật giá trị dựa trên số account đã xử lý
    //   }, 500);
    // },
    // stopProgressUpdate() {
    //   // Dừng setInterval và đặt lại trạng thái
    //   clearInterval(this.intervalId);
    //   this.intervalId = null;
    //   this.inProgress = false;
    // },
    // async processAccount(account) {
    //   try {
    //     let apiUrl = API_URL + `/accounts/users/${account[2]}/update/`;
    //     let data = {
    //       rooms: this.modals.roomDetail.code
    //     };

    //     const token = localStorage.getItem("access_token");

    //     const response = await axios.put(apiUrl, data, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     this.successValue++;
    //     this.tableSuccess.push(account);
    //     this.$notify({
    //       type: "success",
    //       icon: "tim-icons icon-check-2",
    //       message: response.data.detail,
    //       timeout: 3000,
    //       verticalAlign: "top",
    //       horizontalAlign: "right",
    //     });

    //     return true; // Xử lý thành công
    //   } catch (error) {
    //     console.error("Error registering accounts:", error);

    //     const errorMessage =
    //       error.response?.data ||
    //       "Có lỗi xảy ra. Vui lòng thử lại sau";
    //     this.$notify({
    //       type: "danger",
    //       icon: "tim-icons icon-bell-55",
    //       message: errorMessage,
    //       timeout: 3000,
    //       verticalAlign: "top",
    //       horizontalAlign: "right",
    //     });

    //     return false; // Xử lý thất bại
    //   }
    // },
    // addRoom() {
    //   const token = localStorage.getItem("access_token");
    //   let data = this.modals.roomCreate
    //   axios
    //     .post(API_URL+"/managements/rooms/", data, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Đính kèm token vào headers
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then(() => {
    //        this.$notify({
    //             type: "success",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Thêm lớp học thành công`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //           this.initBigChart(this.bigLineChart.activeIndex);
    //           this.modals.roomCreateModal = false;
    //     })
    //     .catch((error) => {
    //       console.error("Error create data :", error);

    //       this.$notify({
    //             type: "warning",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Thêm lớp học không thành công`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     });
    // },
    // downloadExcel() {
    //   // Tìm phần tử xlsx-download và kích hoạt link download
    //   const downloadLink = this.$refs.excelDownload.$el.querySelector('a');
    //   if (downloadLink) {
    //     downloadLink.click();
    //   } else {
    //     console.error("Không tìm thấy link tải xuống.");
    //   }
    // },
    // updateCollection(newCollection) {
    //   this.collection = newCollection; // Lưu collection vào this.collection
    //   this.formatRoomData()
    // },
    // formatRoomData(){
    //   console.log(this.collection)
    //   console.log(this.selectedSheet)
    //   const [roomName, teacherId] = this.selectedSheet.split("-");
        
    //   // Lưu vào các biến cần thiết
    //   this.roomCreateName = roomName;
    //   this.homeRoomTeacherId = teacherId;
    //   this.allCreateStudent = this.collection.map(item => item.user_id);
    
    //   console.log(this.allCreateStudent); // Kiểm tra kết quả
    //   this.createRoom()

    // },
    // async createRoom() {
    //   try {
    //     // Tạo tên lớp học
    //     await this.createRoomName();

    //     // Thêm học sinh vào lớp học
    //     await this.addStudent();

    //     await this.addHomeRoomTeacher();

    //     // Khởi tạo biểu đồ lớn
    //     this.initBigChart(this.bigLineChart.activeIndex);

    //     // Đóng modal tạo lớp học
    //     this.modals.roomCreateModal = false;
    //   } catch (error) {
    //     console.error("Error creating room:", error);
    //     // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
    //   }
    // },
    // addHomeRoomTeacher(){
    //   const token = localStorage.getItem("access_token");
    //   axios
    //     .patch(API_URL+`/rooms/${this.roomCreateName}/`, { "homeroom_teacher": this.homeRoomTeacherId }, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Đính kèm token vào headers
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then(() => {
    //        this.$notify({
    //             type: "success",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Thêm giáo viên chủ nhiệm vào lớp thành công`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     })
    //     .catch((error) => {
    //       console.error("Error create data :", error);

    //       this.$notify({
    //             type: "warning",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Thêm giáo viên chủ nhiệm vào lớp không thành công`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     });
    // },
    // createRoomName(){
    //   const token = localStorage.getItem("access_token");
    //   axios
    //     .post(API_URL+`/rooms/`, { "name": this.roomCreateName }, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Đính kèm token vào headers
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then(() => {
    //        this.$notify({
    //             type: "success",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Tạo lớp học thành công`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     })
    //     .catch((error) => {
    //       console.error("Error create data :", error);

    //       this.$notify({
    //             type: "warning",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Tạo lớp học thất bại`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     });
    // },
    // addStudent(){
    //   const token = localStorage.getItem("access_token");
    //   const data = {
    //     "room": this.roomCreateName,
    //     "students": this.allCreateStudent
    //   }
    //   console.log(data)
    //   axios
    //     .post(API_URL+`/rooms/addstudents/`, data, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Đính kèm token vào headers
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then(() => {
    //       this.$notify({
    //             type: "success",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Thêm học sinh vào lớp thành công`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     })
    //     .catch((error) => {
    //       console.error("Error create data :", error);

    //       this.$notify({
    //             type: "warning",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Thêm học sinh vào lớp thất bại`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     });
    // },
    // triggerFileUpload() {
    //   this.$refs.fileInput.click(); // Trigger file input click event
    // },
    // handleFileUpload(event) {
    //   this.selectedFile = event.target.files[0]; // Get selected file
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const data = new Uint8Array(e.target.result);
    //     const workbook = XLSX.read(data, { type: "array" });
    //     this.sheetName = workbook.SheetNames[0]; // Chọn sheet đầu tiên
    //     const sheet = workbook.Sheets[this.sheetName];

    //     // Chuyển đổi dữ liệu sheet sang JSON
    //     const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    //     console.log("Full data:", jsonData);

    //     // Lấy tiêu đề cột từ dòng 5
    //     this.tableHeaders = jsonData[0];

    //     // Lấy dữ liệu từ dòng 7 trở đi
    //     this.tableData = jsonData.slice(1);
    //     console.log("Filtered data:", this.tableData);
    //   };
    //   reader.readAsArrayBuffer(this.selectedFile);
    // },

    // onChange(event) {
    //   this.file = event.target.files ? event.target.files[0] : null;
    // },
    // addSheet() {
    //   this.sheets.push({ name: this.sheetName, data: [...this.collection] });
    //   this.sheetName = null;
    // },
    // studentDataLength() {
    //   return this.studentData.length
    // },
    // toggleRoomDetail(room){
    //   this.modals.roomDetailModal = true;
    //   this.selectedFile = null;
    //   this.modals.roomDetail = room
    //   console.log(this.modals.roomDetail)

    //   //get all student of room
    //   const token = localStorage.getItem("access_token");
    //   axios
    //     .get(API_URL+`/users/students/?rooms=${this.modals.roomDetail.code}/`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Đính kèm token vào headers
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then((response) => {
    //       this.studentData = response.data
    //     })
    //     .catch((error) => {
    //       console.error("Error get user data :", error);

    //       this.$notify({
    //             type: "warning",
    //             icon: 'tim-icons icon-bell-55',
    //             message: `Lấy danh sách học sinh lớp ${this.modals.roomDetail.name} thất bại`,
    //             timeout: 3000,
    //             verticalAlign: "top",
    //             horizontalAlign: "right",
    //           });
    //     });
    // },
    
    
    
    
    removeObject(){
        const token = localStorage.getItem("access_token");
        let apiUrl = ""; // API URL sẽ thay đổi dựa trên loại đăng ký
        // if (this.bigLineChart.activeIndex === 0 && this.modals.removeRoomModal) {
        //   apiUrl = API_URL + `/managements/rooms/${this.modals.idRemove}/`;
        // }
        if (this.bigLineChart.activeIndex === 0) {
          apiUrl = API_URL + "/accounts/users/" + this.modals.idRemove + "/delete/";
        } else if (this.bigLineChart.activeIndex === 1) {
          apiUrl = API_URL + "/accounts/users/" + this.modals.idRemove + "/delete/";
        } else if (this.bigLineChart.activeIndex === 2) {
          apiUrl = API_URL + "/accounts/users/" + this.modals.idRemove + "/delete/";
        }

        axios
        .delete(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let message = "";

           if (this.bigLineChart.activeIndex === 0) {
            message = "Xóa thành công"
          } else if (this.bigLineChart.activeIndex === 1) {
            message = "Xóa giáo viên thành công"
          } else if (this.bigLineChart.activeIndex === 2) {
            message = "Xóa phụ huynh thành công"
          }
            this.$notify({
                type: "success",
                icon: 'tim-icons icon-check-2',
                message: message,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
          this.modals.removeModal = false
          this.modals.removeRoomModal = false
          this.initBigChart(this.bigLineChart.activeIndex)
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Người dùng không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    
    
    
    
    updateObject(){

        let dataUser = null;
        let formData = new FormData();
        let apiUrl = ""; // API URL sẽ thay đổi dựa trên loại đăng ký
        if (this.bigLineChart.activeIndex === 0) {
          apiUrl = API_URL+ `/accounts/users/${this.modals.studentDetail.user_id}/update/`;
          dataUser = this.modals.studentDetail
          // formData.append('full_name', this.modals.studentDetail.full_name);
          // formData.append('sex', this.modals.studentDetail.sex);
          // formData.append('day_of_birth', this.modals.studentDetail.day_of_birth);
          // formData.append('active_status', this.modals.studentDetail.active_status);
        } else if (this.bigLineChart.activeIndex === 1) {
          apiUrl = API_URL+ `/accounts/users/${this.modals.teacherDetail.user_id}/update/`;
          dataUser = {
              email: this.modals.teacherDetail.email,
              phone_number: this.modals.teacherDetail.phone_number,
              full_name: this.modals.teacherDetail.full_name,
              sex: this.modals.teacherDetail.sex,
              day_of_birth: this.modals.teacherDetail.day_of_birth,
              nation: this.modals.teacherDetail.nation,
              active_status: this.modals.teacherDetail.active_status,
              contract_types: this.modals.teacherDetail.teacher.contract_types,
              expertise_levels: this.modals.teacherDetail.teacher.expertise_levels,
              subjects: this.modals.teacherDetail.teacher.subjects
              // subjects: "Toán, Lý"
          }
        } else if (this.bigLineChart.activeIndex === 2) {
          apiUrl = API_URL+ `/accounts/users/${this.modals.teacherDetail.user_id}/update/`;
          dataUser = this.modals.parentDetail
        }

        console.log(dataUser)
        const token = localStorage.getItem("access_token");
        axios
        .put(apiUrl, dataUser, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          let message = "";
          if (this.bigLineChart.activeIndex === 0) {
          
          message = "Cập nhật thông tin học sinh thành công"
        } else if (this.bigLineChart.activeIndex === 1) {
          
           message = "Cập nhật thông tin giáo viên thành công"
        } else if (this.bigLineChart.activeIndex === 2) {
          
           message = "Cập nhật thông tin phụ huynh thành công"
        }
        this.$notify({
                type: "success",
                icon: 'tim-icons icon-check-2',
                message: message,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
          this.modals.updateModal = false
          this.initBigChart(this.bigLineChart.activeIndex)
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Dữ liệu không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    
    
    
    
    toggleDetail(index){
        this.modals.detailModal = true;
        let data = null;

        let apiUrl = API_URL + `/accounts/users/detail/${index}/`; // API URL sẽ thay đổi dựa trên loại đăng ký
        // if (this.bigLineChart.activeIndex === 0) {
        //   apiUrl = API_URL + "/accounts/students/" + index + "/";
        // } else if (this.bigLineChart.activeIndex === 1) {
        //   data = {
        //       role: "teacher",
        //       fields: ["user_id", "full_name", "sex", "phone_number", "day_of_birth", "nation", "expertise_levels","contract_type", "subjects"]

        //   };
        // } else if (this.bigLineChart.activeIndex === 2) {
        //   apiUrl = API_URL + "/accounts/parents/" + index + "/";
        // }



        const token = localStorage.getItem("access_token");
        axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {

          if (this.bigLineChart.activeIndex === 0) {
            this.modals.studentDetail = response.data
          } else if (this.bigLineChart.activeIndex === 1) {
            this.modals.teacherDetail = response.data
          } else if (this.bigLineChart.activeIndex === 2) {
            this.modals.parentDetail = response.data
          }

          console.log(response.data)
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Người dùng không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    
    
    toggleUpdate(index){
        this.modals.updateModal = true;

        let apiUrl = API_URL + `/accounts/users/detail/${index}/`; // API URL sẽ thay đổi dựa trên loại đăng ký
        // if (this.bigLineChart.activeIndex === 0) {
        //   apiUrl = API_URL + "/accounts/students/" + index + "/";
        // } else if (this.bigLineChart.activeIndex === 1) {
        //   apiUrl = API_URL + "/accounts/teachers/" + index + "/";
        // } else if (this.bigLineChart.activeIndex === 2) {
        //   apiUrl = API_URL + "/accounts/parents/" + index + "/";
        // }

        const token = localStorage.getItem("access_token");
        axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
           if (this.bigLineChart.activeIndex === 0) {
            this.modals.studentDetail = response.data
          } else if (this.bigLineChart.activeIndex === 1) {
            this.modals.teacherDetail = response.data
          } else if (this.bigLineChart.activeIndex === 2) {
            this.modals.parentDetail = response.data
          }

          console.log(response.data)
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Dữ liệu không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
   
   
   
    toggleRemove(index){
        
        this.modals.removeModal = true;
        console.log(this.modals.removeModal)
        this.modals.idRemove = index;
    },
    toggleRemoveRoom(roomName){
        this.modals.removeRoomModal = true;
        this.modals.idRemove = roomName;
    },
    toggleRemoveCreate(){
        this.getAllTeacher();
        this.modals.roomCreateModal = true;
    },
    getAllTeacher(){
      const token = localStorage.getItem("access_token");
      let data = {
         role: "teacher",
         fields: ["user_id", "full_name"]
      }
      axios
        .post(API_URL+"/accounts/get_users_detail/", data, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
           this.teacherData = response.data
        })
        .catch((error) => {
          console.error("Error create data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Lấy danh sách giáo viên thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    


    fetchRoomsAndUpdateStudents() {
    const token = localStorage.getItem("access_token");
    const roomsApiUrl = API_URL + "/managements/rooms/";
    
    axios
      .get(roomsApiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const roomsList = response.data;
        
        // Tạo map từ room ID đến room name
        const roomMap = {};
        roomsList.forEach(room => {
          roomMap[room.id] = room.name;
        });
        
        // Cập nhật tên phòng học cho từng học sinh
        this.studentData.forEach(student => {
          // Giả sử student.rooms là ID của phòng học
          if (student.rooms && roomMap[student.rooms]) {
            // Lưu tên phòng học vào biến tạm thời hoặc cập nhật trực tiếp
            // const roomName = roomMap[student.rooms];
            // student.roomName = roomName; // Lưu vào trường mới để không ghi đè lên ID
            // Hoặc nếu bạn muốn thay thế hoàn toàn giá trị rooms:
            // student.rooms = roomName;
            student.rooms = roomMap[student.rooms]
          } else {
            // student.roomName = "Chưa phân lớp";
            student.rooms = "Chưa phân lớp";
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        this.$notify({
          type: "warning",
          icon: 'tim-icons icon-bell-55',
          message: "Không thể lấy thông tin phòng học. Vui lòng thử lại",
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "right",
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

      let data = null;
      let apiUrl = ""; // API URL sẽ thay đổi dựa trên loại đăng ký
      if (this.bigLineChart.activeIndex === 0) {
        apiUrl = API_URL + "/users/students/";
      } else if (this.bigLineChart.activeIndex === 1) {
        apiUrl = API_URL + "/users/teachers/";
        // data = {
        //       role: "teacher",
        //       fields: ["user_id", "full_name", "sex", "day_of_birth", "subjects"]
        // };
      } else if (this.bigLineChart.activeIndex === 2) {
        apiUrl = API_URL + "/users/admins/";
        // data = {
        //       role: "admin",
        //       fields: ["user_id", "full_name", "sex", "day_of_birth", "description"]
        // };
      } 

      //Get data
      const token = localStorage.getItem("access_token");
      if(this.bigLineChart.activeIndex === 0){
        axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
            this.studentData = response.data
            this.fetchRoomsAndUpdateStudents()
          
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Người dùng không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
      }
      else {
        axios
        .get(apiUrl ,  {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {

          if(this.bigLineChart.activeIndex === 1) this.teacherData = response.data
          // else if(this.bigLineChart.activeIndex === 2) this.parentData = response.data
          else if(this.bigLineChart.activeIndex === 2) this.adminData = response.data
          
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Người dùng không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
      }
      
    },

    resetPassword() {
      const token = localStorage.getItem("access_token");
      const resetPasswordData = {
        user_id: this.id_user_reset,
      };

      axios
        .post(API_URL + "/accounts/admin-reset-password/", resetPasswordData, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
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
          this.isEditingResetPassword = false; // Tắt chế độ chỉnh sửa

          this.user_id_reset = null;
        })
        .catch((error) => {

          if (error.response && error.response.data) {
            if (error.response.status === 401) {
              this.$notify({
                type: "success",
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
                message: "Người dùng không tồn tại. Vui lòng thử lại",
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

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      let apiUrl = ""; // API URL sẽ thay đổi dựa trên loại đăng ký
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
          timeout: 30000,
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
                // const errorMessage =
                //   "Vui lòng kiểm tra lại cấu trúc file và loại đối tượng đăng ký ";
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

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* Khoảng cách giữa các card */
}

.card-item {
  flex: 1 1 18%; /* Đảm bảo mỗi card chiếm khoảng 18% chiều rộng */
  max-width: 10rem; /* Đặt chiều rộng tối đa cho mỗi card */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>