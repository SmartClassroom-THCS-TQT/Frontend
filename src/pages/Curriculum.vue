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
                v-for="(option, index) in curriculumOption"
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

        <!-- Device -->
        <!-- <div v-if="bigLineChart.activeIndex === 2">
          <base-table :data="deviceData" :columns="device_columns">
            <template slot="columns">
              <th>ID thiết bị</th>
              <th>Phòng học</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.device_id }}</td>
              <td>{{ row.room }}</td>
            </template>
          </base-table>
        </div> -->

        <div v-if="bigLineChart.activeIndex === 0">
          
          <div class="row" v-if="semesterDetailStatus">
            

            <!-- Card hiển thị học kỳ -->
            <div
              v-for="semester in semesterData"
              :key="semester.code"
              class="col-lg-3 col-md-4 col-sm-6 mb-4"
              @click="toggleSemesterDetail(semester.code)"
            >
              <div class="card semester-card shadow border-0 h-100">
                <div class="card-body">
                  <h5 class="card-title text-primary">{{ semester.code }}</h5>
                  <div class="d-flex align-items-center mb-2">
                    <i class="tim-icons icon-calendar-60 text-muted mr-2"></i>
                    <span>Ngày bắt đầu: <strong>{{ semester.start_date }}</strong></span>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="tim-icons icon-watch-time text-muted mr-2"></i>
                    <span>Số tuần: <strong>{{ semester.weeks_count }}</strong></span>
                  </div>
                </div>
                <div class="card-footer d-flex justify-content-between">
                  <base-button
                    type="success"
                    size="sm"
                    icon
                    @click.stop="toggleUpdate(semester.code)"
                  >
                    <i class="tim-icons icon-settings"></i>
                  </base-button>
                  <base-button
                    type="danger"
                    size="sm"
                    icon
                    @click.stop="toggleRemove(semester.code)"
                  >
                    <i class="tim-icons icon-simple-remove"></i>
                  </base-button>
                </div>
              </div>

              
            </div>

            <!-- Card Thêm học kỳ -->
            <div class="add-semester-button">
              <button class="btn-add" @click="toggleCreate()">
                <i class="fa fa-plus-circle"></i> Thêm học kỳ
              </button>
            </div>
          </div>

          <!-- Card hiển thị lớp trong học kỳ -->
           <div class="row" v-if="selectedSemester && roomDetailStatus">
            <div class="semester-header">
              <h1 class="semester-title">{{ selectedSemester }}</h1>
              <base-button type="info" size="sm" icon @click="toggleSwitchSemester()">
                  <i class="tim-icons icon-refresh-01"></i>
                </base-button>
            </div>

            <div v-for="(room, index) in roomData" :key="index" class="card-item" @click="toggleRoomOptionDetail(room)">
              <card class="text-center" style="width: 10rem;">
                <h4 class="card-title text-info">{{ room.name }}</h4>
                <base-button type="info" size="sm" icon @click="toggleRoomDetail(room)">
                  <i class="tim-icons icon-single-02"></i>
                </base-button>
                <base-button type="danger" size="sm" icon @click="toggleRemoveRoom(room.code)">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </card>
            </div>

            <div class="add-semester-button">
              <button class="btn-add" @click="toggleRemoveCreate()">
                <i class="fa fa-plus-circle"></i> Thêm lớp học
              </button>
            </div>
          </div>


          <div v-if="selectedRoomOption" class="semester-detail">
            <!-- Nút quay lại -->
            <button class="back-button" @click="closeSemesterDetail">
              Quay lại
            </button>

            <!-- Tiêu đề học kỳ -->
            <h1 class="semester-title">Học kỳ {{  selectedSemester  }} - {{ selectedRoomOption.name}}</h1>

            <!-- Nhóm các nút chức năng -->
            <div class="button-group">
              <div
                class="action-card action-card-blue"
                :class="{ active: selectedAction === 'viewClassList' }"
                @click="viewClassList()"
              >
                <i class="fas fa-users icon"></i>
                <p class="action-text">Xem danh sách lớp</p>
              </div>
              <div
                class="action-card action-card-green"
                :class="{ active: selectedAction === 'viewSchedule' }"
                @click="viewSchedule()"
              >
                <i class="fas fa-calendar-alt icon"></i>
                <p class="action-text">Thời khóa biểu</p>
              </div>
              <div
                class="action-card action-card-red"
                :class="{ active: selectedAction === 'assignTeachers' }"
                @click="assignTeachers()"
              >
                <i class="fas fa-users icon"></i>
                <p class="action-text">Phân công giáo viên</p>
              </div>
            </div>


            <!-- Danh sách lớp -->
            <div v-if="optionSelected == 1" class="card-container">
              <!-- Loop qua từng lớp học để hiển thị thông tin lớp -->
              <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Chi tiết lớp học {{selectedRoomOption.name}}</h4>
                        <p class="text-info">Giáo viên chủ nhiệm : {{selectedRoomOption.manager}}</p>
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
                      <td>{{ row.user_id }}</td>
                      <td>{{ row.full_name }}</td>
                      <td>{{ row.sex }}</td>
                      <td>{{ row.day_of_birth }}</td>
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
            </div>

            <!-- Thời khóa biểu -->
            <div v-if="optionSelected == 2" class="card-container curriculum-timetable">
              
                <div class="row custom-time-table">
                   <!-- <vue-cal
                      :events="events"
                      default-view="month"
                      locale="vi" 
                      style="height: 500px;"
                    /> -->
                    
                      <div class="calendar-container">
                        <!-- Phần lịch -->
                        <div class="calendar-section">
                          <div class="calendar-header">
                            <button @click="previousMonth" class="nav-button">&lt;</button>
                            <span class="month-title">{{ currentMonthName }} {{ currentYear }}</span>
                            <button @click="nextMonth" class="nav-button">&gt;</button>
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
                                  'has-lesson': day.hasLesson 
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
                          </div>
                          <div class="lesson-content">
                            <ul v-if="selectedDayLessons.length">
                              <li v-for="lesson in selectedDayLessons" :key="lesson.id" @click="toggleSessionDetail(lesson.id)">
                                <div class="lesson-time">Tiết {{ lesson.time_slot.code }}</div>
                                <div class="lesson-info">
                                  <div class="lesson-subject">Môn học: {{ lesson.subject_code.name }}</div>
                                  <div class="lesson-room">Phòng: {{ lesson.room_id.name }}</div>
                                </div>
                              </li>
                            </ul>
                            <div v-if="(!selectedDayLessons.length) && selectedDay" class="empty-state">
                              <i class="fas fa-calendar-times"></i>
                              <p>Không có tiết học nào.</p>
                            </div>
                          </div>
                          <div class="add-session-button">
                            <button class="btn-add-session" @click="toggleCreateSession()">
                              <i class="fa fa-plus-circle"></i> Thêm tiết học
                            </button>
                          </div>
                        </div>
                      </div>


                    
                </div>
                

          </div>

          
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
                                            <option class="text-info" v-for="(teacher, index) in teacherData" :key="index" :value="teacher.account">{{ teacher.full_name + " - " + teacher.account }}</option>
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

        <!-- Create Modal -->
        

        <!-- Update Modal -->
        <modal :show.sync="modals.updateModal"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
               <!-- Semester -->
            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 0 && modals.semesterDetail">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Cập nhật học kỳ</h4>
                    </div>
                </template>
                <template v-if="modals.semesterDetail">
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input disabled label="Học kỳ" v-model="modals.semesterDetail.code"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Ngày bắt đầu" v-model="modals.semesterDetail.start_date" type="date"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Số tuần" v-model="modals.semesterDetail.weeks_count"></base-input>
                                    </div>
                                </div>
                                <base-button @click="updateObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>

            <!-- Time-slots -->

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 1">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Cập nhật tiết học</h4>
                    </div>
                </template>
                <template v-if="modals.timeslotDetail">
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input disabled type="number" label="Tiết số" v-model="modals.timeslotDetail.code"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="time" label="Bắt đầu" v-model="modals.timeslotDetail.start_time"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input type="time" label="Kết thúc" v-model="modals.timeslotDetail.end_time"></base-input>
                                    </div>
                                </div>
                                <base-button @click="updateObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>

            <!-- Subjects -->

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 2">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Cập nhật môn học</h4>
                    </div>
                </template>
                <template v-if="modals.subjectDetail">
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input disabled label="Mã môn học" type="number" v-model="modals.subjectDetail.code"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Tên môn học" v-model="modals.subjectDetail.name"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Mô tả" v-model="modals.subjectDetail.description"></base-input>
                                    </div>
                                </div>
                                <base-button @click="updateObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>

            <!-- Tiết học -->

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.sessionModal">

                <template v-if="sessionData">
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-4 pr-md-1">
                                        <base-input type="" label="Tiết" >
                                          <select v-model="sessionData.time_slot" class="form-control">
                                              <option class="text-info" v-for="(timeSlot, index) in timeSlotData" :key="index" :value="timeSlot.code">{{ timeSlot.code}}</option>
                                          </select>
                                        </base-input>
                                    </div>
                                    <div class="col-md-4 pr-md-1">
                                        <base-input type="" label="Môn" >
                                          <select v-model="sessionData.subject_code" class="form-control">
                                              <option class="text-info" v-for="(subject, index) in subjectData" :key="index" :value="subject.code">{{ subject.name}}</option>
                                          </select>
                                        </base-input>
                                    </div>
                                    <div class="col-md-4 pr-md-1">
                                        <base-input type="" label="Học kỳ" v-model="sessionData.semester_code"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="" label="Giáo viên" >
                                          <select v-model="sessionData.teacher" class="form-control">
                                              <option class="text-info" v-for="(teacher, index) in teacherData" :key="index" :value="teacher.account">{{ teacher.full_name + " - " + teacher.account }}</option>
                                          </select>
                                        </base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input type="date" label="Ngày" v-model="sessionData.day"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="number" label="Bài số" v-model="sessionData.lesson_number"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input type="text" label="Tên bài học" v-model="sessionData.lesson_name"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="number" label="Vắng" v-model="sessionData.absent"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input  label="Nhận xét" >
                                          <textarea class="form-control" rows="3" v-model="sessionData.comment"></textarea>
                                        </base-input>
                                    </div>
                                </div>
                                <base-button @click="updateSession" type="secondary" fill>Cập nhật</base-button>
                                <base-button @click="deleteSession" type="danger" fill>Xóa tiết học</base-button>
                            </div>
                        </div>
                </template>
            </card>

            <!-- Tiết học -->

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.createSessionModal">

                <template v-if="modals.sessionCreate">
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-4 pr-md-1">
                                        <base-input type="" label="Tiết" >
                                          <select v-model="modals.sessionCreate.time_slot" class="form-control">
                                              <option class="text-info" v-for="(timeSlot, index) in timeSlotData" :key="index" :value="timeSlot.code">{{ timeSlot.code}}</option>
                                          </select>
                                        </base-input>
                                    </div>
                                    <div class="col-md-4 pr-md-1">
                                        <base-input type="" label="Môn" >
                                          <select v-model="modals.sessionCreate.subject_code" class="form-control">
                                              <option class="text-info" v-for="(subject, index) in subjectData" :key="index" :value="subject.code">{{ subject.name}}</option>
                                          </select>
                                        </base-input>
                                    </div>
                                    <div class="col-md-4 pr-md-1">
                                        <base-input type="" label="Học kỳ" v-model="modals.sessionCreate.semester_code"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="" label="Giáo viên" >
                                          <select v-model="modals.sessionCreate.teacher" class="form-control">
                                              <option class="text-info" v-for="(teacher, index) in teacherData" :key="index" :value="teacher.account">{{ teacher.full_name + " - " + teacher.account }}</option>
                                          </select>
                                        </base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input type="date" label="Ngày" v-model="modals.sessionCreate.day"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input type="number" label="Bài số" v-model="modals.sessionCreate.lesson_number"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input type="text" label="Tên bài học" v-model="modals.sessionCreate.lesson_name"></base-input>
                                    </div>
                                </div>
                                
                                <base-button @click="createOneSession" type="secondary" fill>Thêm 1 phiên học</base-button>
                                <base-button @click="createFullSession" type="secondary" fill>Thêm phiên học cả kỳ</base-button>
                            </div>
                        </div>
                </template>
            </card>

        </modal>

        

        <!-- Remove Modal -->
        <modal :show.sync="modals.removeModal">
            <h4 slot="header" class="modal-title" id="modal-title-default" v-if="this.bigLineChart.activeIndex === 0">Xác nhận xóa học kỳ này </h4>
            <h4 slot="header" class="modal-title" id="modal-title-default" v-if="this.bigLineChart.activeIndex === 1">Xác nhận xóa tiết học này </h4>
            <h4 slot="header" class="modal-title" id="modal-title-default" v-if="this.bigLineChart.activeIndex === 2">Xác nhận xóa môn học này </h4>
            <template slot="footer">
                <base-button type="secondary" @click="removeObject">Xác nhận</base-button>
                <base-button type="danger" class="ml-auto" @click="modals.removeModal = false">Hủy
                </base-button>
            </template>
        </modal>

        <!-- Seating Modal -->
        <!-- <modal :show.sync="modals.seatingModal"
                body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0">
                <template>
                    <div class="text-muted mb-3">
                        <h4 class="text-dark text-">Quản lý chỗ ngồi</h4>
                    </div>
                </template>
                <template>
                      <base-table :data="seatingData" :columns="seating_columns">
                        <template slot="columns">
                          <th>Học sinh</th>
                          <th class="text-center">Hàng</th>
                          <th class="text-center">Cột</th>
                        </template>
                        <template slot-scope="{ row }">
                          <td> <div class="text-info"> {{ row.student }}</div></td>
                          <td class="text-center">{{ row.row }}</td>
                          <td class="text-center">{{ row.column }}</td>
                        </template>
                      </base-table>
                     
                </template>
            </card>
        </modal> -->

        <!-- BÀI GIẢNG -->
        <!-- <div v-if="bigLineChart.activeIndex === 1">
          <base-table :data="plannedlessonData" :columns="plannedlesson_columns">
            <template slot="columns">
              <th>ID</th>
              <th>Môn học</th>
              <th>Bài số</th>
              <th>Tên bài học</th>
              <th>Học kỳ</th>
              <th>Lớp</th>
              <th class="text-right">Actions</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.id }}</td>
              <td>{{ row.subject }}</td>
              <td>{{ row.lesson_number }}</td>
              <td>{{ row.name_lesson }}</td>
              <td>{{ row.semester }}</td>
              <td>{{ row.room }}</td>
              <td class="td-actions text-right">
                <base-button type="success" size="sm" icon @click="toggleUpdate(row.id)">
                  <i class="tim-icons icon-settings"></i>
                </base-button>
                <base-button type="danger" size="sm" icon @click="toggleRemove(row.id)">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </td>
            </template>
          </base-table>
          <base-button type="default" size="sm" icon @click="toggleCreate()">
                  <i class="tim-icons icon-simple-add"></i>
          </base-button>
        </div> -->

        <!-- Tiết học -->
        <div v-if="bigLineChart.activeIndex === 1">
          <base-table :data="timeslotData" :columns="timeslot_columns">
            <template slot="columns">
              <th>Tiết số</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th class="text-right">Actions</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.code }}</td>
              <td>{{ row.start_time }}</td>
              <td>{{ row.end_time }}</td>
              <td class="td-actions text-right">
                <base-button type="success" size="sm" icon @click="toggleUpdate(row.code)">
                  <i class="tim-icons icon-settings"></i>
                </base-button>
                <base-button type="danger" size="sm" icon @click="toggleRemove(row.code)">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </td>
            </template>
          </base-table>
          <base-button type="default" size="sm" icon @click="toggleCreate()">
                  <i class="tim-icons icon-simple-add"></i>
          </base-button>
        </div>

          <!-- Môn học -->
        <div v-if="bigLineChart.activeIndex === 2">
          <base-table :data="subjectData" :columns="subject_columns">
            <template slot="columns">
              <th>Mã môn học</th>
              <th>Tên môn học</th>
              <th>Mô tả</th>
              <th class="text-right">Actions</th>
            </template>
            <template slot-scope="{ row }">
              <td>{{ row.code }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.description }}</td>
              <td class="td-actions text-right">
                <base-button type="success" size="sm" icon @click="toggleUpdate(row.code)">
                  <i class="tim-icons icon-settings"></i>
                </base-button>
                <base-button type="danger" size="sm" icon @click="toggleRemove(row.code)">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </td>
            </template>
          </base-table>
          <base-button type="default" size="sm" icon @click="toggleCreate()">
                  <i class="tim-icons icon-simple-add"></i>
          </base-button>
        </div>

      </card>

      <modal :show.sync="modals.createModal"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
               <!-- Semester -->
               
            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Thêm học kỳ</h4>
                    </div>
                </template>
                <template>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Học kỳ (VD: 20241)" v-model="modals.semesterCreate.code"></base-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pr-md-1">
                                        <base-input label="Ngày bắt đầu" v-model="modals.semesterCreate.start_date" type="date"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Số tuần" v-model="modals.semesterCreate.weeks_count"></base-input>
                                    </div>
                                </div>
                                <base-button @click="createObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>

            <!-- Time-slots -->

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 1">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Thêm tiết học</h4>
                    </div>
                </template>
                <template>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Tiết số" type="number" v-model="modals.timeslotCreate.code"></base-input>
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Bắt đầu" type="time" v-model="modals.timeslotCreate.start_time"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Kết thúc" type="time" v-model="modals.timeslotCreate.end_time"></base-input>
                                    </div>
                                </div>
                                
                                <base-button @click="createObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>

            

                        <!-- Môn học -->

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" v-if="this.bigLineChart.activeIndex === 2">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h4 class="text-dark">Thêm môn học</h4>
                    </div>
                </template>
                <template>
                        <div class="row">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-md-12 pr-md-1">
                                        <base-input label="Mã môn học" type="number" v-model="modals.subjectCreate.code"></base-input>
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Tên môn học" v-model="modals.subjectCreate.name"></base-input>
                                    </div>
                                    <div class="col-md-6 pl-md-1">
                                        <base-input label="Mô tả" v-model="modals.subjectCreate.description"></base-input>
                                    </div>
                                </div>
                                
                                <base-button @click="createObject" type="secondary" fill>Xác nhận</base-button>
                            </div>
                        </div>
                </template>
            </card>
        </modal>

    </div>
  </div>
</template>

<script>
import axios from "../services/axios";
let API_URL = ""

import config from "@/config";
import Card from "../components/Cards/Card.vue";
import BaseTable from '../components/BaseTable.vue';
import Modal from '../components/Modal.vue';
import BaseInput from '../components/Inputs/BaseInput.vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
// import { SetupCalendar, Calendar } from 'v-calendar';

// import 'v-calendar/lib/v-calendar.min.css';

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
    XlsxDownload,
    // VCalendar: Calendar
    VueCal 
   },
  mounted() {
      this.initializeData();
      this.initBigChart(0);
  },
  data() {
    return {
    modals: {
        roomDetailModal: false,
        seatingModal: false,
        roomCreateModal: false,
        roomDetail: null,
        
        createModal: false,
        updateModal: false,
        removeModal: false,
        idRemove: null,

        semesterCreate: {
          code: null,
          start_date: null,
          weeks_count: null,
          academic_year: 2024,
        },

        sessionCreate: {
          semester_code: null,
          subject_code: null,
          room_id: null,
          day: null,
          time_slot: null,
          teacher: null,
          lesson_number: null,
          lesson_name: null
        },

        plannedLessonCreate: {
          semester: null,
          subject: null,
          name_lesson: null,
          lesson_number: null,
          room: null,
        },

        roomCreate: {
          code: null,
          name: null,
          manager: null,
          academic_year: 1,
        },

        timeslotCreate: {
          code: null,
          start_time: null,
          end_time: null,
        },

        subjectCreate: {
          code: null,
          name: null,
          description: null
        },

        teacherModal: false,
        parentModal: false,
        semesterDetail: null,
        teacherDetail: null,
        plannedLessonDetail: null,
        timeslotDetail: null,
        subjectDetail: null,
    },
    successValue: 0,
    intervalId: null,
    tableSuccess: null,
    inProgress: false,
    value: 45,
    max: 100,
    inProgress: false,
    selectedFile: null,
    file: null,
    // attributes: [
    //     {
    //       key: 'has-classes',
    //       dates: ['2025-02-05', '2025-02-10', '2025-02-20'],
    //       highlight: { backgroundColor: '#ffd54f', borderRadius: '50%' },
    //     },
    //   ],

    // events: [
    //     {
    //       start: '2025-03-15',
    //       end: '2025-03-15',
    //       title: 'Lịch học Toán',
    //       class: 'event-toan',
    //     },
    //     {
    //       start: '2025-03-16',
    //       end: '2025-03-16',
    //       title: 'Lịch học Văn',
    //       class: 'event-van',
    //     },
    //   ],
      selectedDayLessons: [],
      lessons: [
        {
          id: 1,
          semester_code: 1,
          subject_code: 101,
          room_id: 202,
          day: "2025-03-19",
          time_slot: 2,
        },
        {
          id: 2,
          semester_code: 1,
          subject_code: 101,
          room_id: 202,
          day: "2025-03-20",
          time_slot: 3,
        },
      ],
      currentDate: new Date(),

      selectedDay: null,
      sessionModal: false,
      timeSlotData: null,
      subjectData: null,
      createSessionModal: false,
      
    sheets: [{ name: "Cập nhật học sinh",
         data: [ { "STT": 1, "Thứ tự": "1", "user": "3581635860", "Họ tên": "Nguyễn Trịnh Bảo An", "Ngày sinh": "04/09/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 2, "Thứ tự": "2", "user": "3581635894", "Họ tên": "Cao Danh Hải Anh", "Ngày sinh": "22/05/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 3, "Thứ tự": "3", "user": "3581635904", "Họ tên": "Hà Đặng Nhật Anh", "Ngày sinh": "12/06/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 4, "Thứ tự": "4", "user": "3581635898", "Họ tên": "Đặng Ngọc Doanh", "Ngày sinh": "01/08/2012", "Giới tính": "Nam", "Dân tộc": "Kinh", "Trạng thái": "Đang học" },
               { "STT": 5, "Thứ tự": "5", "user": "3581635865", "Họ tên": "Phạm Minh Giang", "Ngày sinh": "27/11/2012", "Giới tính": "Nữ", "Dân tộc": "Kinh", "Trạng thái": "Đang học" } ] }],
    selectedSheet: null,
    sheetName: null,
    semesterDetailStatus: true,
    selectedSemester: null,
    selectedRoom: null,
    selectedRoomOption: null,
    optionSelected : null,
    selectedAction: null,

    sessionData: null,
    teacherData: null,
    studentData: null,
    seatingData: null,
    rooms: null,
    seating_columns: ["student", "row", "column"],
    student_columns: ["user", "full_name", "sex", "day_of_birth", "active_status", "actions"],
    subjects: ['TOAN', 'VAN', 'ANH', 'KHTN_HOA', 'KHTN_LY', 'KHTN_SINH', 'KHXH_DIA', 'KHXH_SU', 'KHXH_GDCD', 'TD', 'MT', 'AN', 'TH', 'CN', 'HDTN-HN'],
    subjects_2: ['Toán', 'Ngữ Văn', 'Tiếng Anh', 'Hóa', 'Sinh học', 'Địa lý', 'Lịch sử', 'GDCD', 'Thể dục', 'Mỹ thuật', 'Âm nhạc', 'Tin học', 'Mỹ thuật'],
    semester_columns: ["semester", "day_begin", "number_of_weeks"],
    room_columns: ["name", "students", "homeroom_teacher"],
    plannedlesson_columns: ["id", "subject", "lesson_number", "name_lesson", "semester", "room"],
    timeslot_columns: ["code", "start_time", "end_time"],
    subject_columns: ["code", "name", "description"],
    lesson_columns: ["user", "full_name", "sex", "day_of_birth", "description"],
      semesterData: null,
      roomData: null,
      plannedlessonData: null,
      timeslotData: null,
      subjectData: null,
      lessonData: null,
      deviceData: null,
      gradeData: null,
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
    curriculumOption() {
      return this.$t("dashboard.curriculum");
    },
    currentYear() {
      return this.currentDate.getFullYear();
    },
    currentMonth() {
      return this.currentDate.getMonth();
    },
    currentMonthName() {
      return this.currentDate.toLocaleString("default", { month: "long" });
    },
    daysOfWeek() {
      return ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const days = [];

      const startDayOfWeek = (firstDay.getDay() + 6) % 7;
      for (let i = startDayOfWeek; i > 0; i--) {
        const date = new Date(firstDay);
        date.setDate(date.getDate() - i);
        const formattedDate = this.formatDate(date);
        days.push({
          date,
          isToday: false,
          isOtherMonth: true,
          hasLesson: this.lessons.some((lesson) => lesson.day === formattedDate),
        });
      }

      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        const formattedDate = this.formatDate(date);
        const isToday = this.isSameDate(date, new Date());
        days.push({
          date,
          isToday,
          isOtherMonth: false,
          hasLesson: this.lessons.some((lesson) => lesson.day === formattedDate),
        });
      }

      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(lastDay);
        date.setDate(date.getDate() + i);
        const formattedDate = this.formatDate(date);
        console.log("Checking:", formattedDate, this.lessons.some((lesson) => lesson.day === formattedDate));
        days.push({
          date,
          isToday: false,
          isOtherMonth: true,
          hasLesson: this.lessons.some((lesson) => lesson.day === formattedDate),
        });
      }

      return days;
    },
  },
  methods: {
    createOneSession(){

    },
    createFullSession(){

    },
    selectDay(date) {
      console.log(date); // Kiểm tra giá trị của date
      this.selectedDay = date;
      this.selectedDayLessons = this.lessons.filter((lesson) => lesson.day === date);
    },
    previousMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.currentDate = new Date(this.currentDate);
    },
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.currentDate = new Date(this.currentDate);
    },
    isSameDate(date1, date2) {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatDisplayDate(date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    getTimeSlot(){
      const token = localStorage.getItem("access_token");

      axios
        .get(API_URL+"/managements/time-slots/", {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
           this.timeSlotData = response.data
        })
        .catch((error) => {
          console.error("Error create data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Lấy danh sách tiết học thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    getSubject(){
      const token = localStorage.getItem("access_token");

      axios
        .get(API_URL+"/managements/subjects/", {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
           this.subjectData = response.data
        })
        .catch((error) => {
          console.error("Error create data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Lấy danh sách môn học thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    toggleCreateSession(){
      this.getAllTeacher();
      this.getTimeSlot();
      this.getSubject();
      this.createSessionModal = true;
      this.modals.updateModal = true
    },
    toggleSessionDetail(sessionId){
      this.getAllTeacher();
      this.getTimeSlot();
      this.getSubject();

      this.modals.updateModal = true
      this.sessionModal = true
      const token = localStorage.getItem("access_token");
      axios
        .get(API_URL+`/managements/sessions/${sessionId}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
           this.sessionData = response.data
           console.log(this.sessionData)
        })
        .catch((error) => {
          console.error("Error create data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Lấy chi tiết tiết học thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
      
    },
    updateSession(){
      const token = localStorage.getItem("access_token");
      
      axios
        .put(API_URL+`/managements/sessions/${this.sessionData.id}/`,this.sessionData, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then(() => {
           this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: `Cập nhật tiết học thành công`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
              this.sessionModal = false;
              this.modals.updateModal = false
        })
        .catch((error) => {
          console.error("Error create data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Cập nhật tiết học thành công thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    deleteSession(){
      const token = localStorage.getItem("access_token");
      
      axios
        .delete(API_URL+`/managements/sessions/${this.sessionData.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then(() => {
           this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: `Xóa tiết học thành công`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
              this.sessionModal = false;
              this.modals.updateModal = false
              this.getSession();
        })
        .catch((error) => {
          console.error("Error create data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Xóa tiết học thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    toggleSwitchSemester(){
      this.selectedSemester = null;
      this.semesterDetailStatus = true;
    },
    addRoom() {
      const token = localStorage.getItem("access_token");
      let data = this.modals.roomCreate
      axios
        .post(API_URL+"/managements/rooms/", data, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then(() => {
           this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: `Thêm lớp học thành công`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
              this.initBigChart(this.bigLineChart.activeIndex);
              this.getRoomData();
              this.modals.roomCreateModal = false;
        })
        .catch((error) => {
          console.error("Error create data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Thêm lớp học không thành công`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
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
        .get(API_URL+"/users/teachers/", data, {
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
     handleDayClick(day) {
      const selectedDate = day.date.toISOString().split('T')[0];
      alert(`Bạn đã chọn ngày: ${selectedDate}`);
    },
    // selectAction(action) {
    //   this.selectedAction = action; // Cập nhật nút được chọn
    // },
    async registerAccountsTest() {
      this.tableSuccess = [];
      if (!this.tableData.length) {
        alert("Không có account nào để xử lý.");
        return;
      }
      console.log("sheetName"+this.sheetName)
      if(this.sheetName != "Cập nhật học sinh"){
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-bell-55",
          message: "Vui lòng kiểm tra lại định dạng Excel" ,
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
            message: "Số học sinh mới được thêm vào lớp : "+this.successValue,
            timeout: 3000,
            verticalAlign: "top",
            horizontalAlign: "right",
          });
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
    async processAccount(account) {
      try {
        let apiUrl = API_URL + `/users/students/${account[2]}/`;
        let data = {
          "room": this.selectedRoomOption.name
          
        };
        console.log(apiUrl)
        const token = localStorage.getItem("access_token");

        const response = await axios.put(apiUrl, data, {
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

        const errorMessage =
          error.response?.data ||
          "Có lỗi xảy ra. Vui lòng thử lại sau";
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-bell-55",
          message: errorMessage,
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "right",
        });

        return false; // Xử lý thất bại
      }
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
        this.tableHeaders = jsonData[0];

        // Lấy dữ liệu từ dòng 7 trở đi
        this.tableData = jsonData.slice(1);
        console.log("Filtered data:", this.tableData);
      };
      reader.readAsArrayBuffer(this.selectedFile);
    },
    downloadExcel() {
      // Tìm phần tử xlsx-download và kích hoạt link download
      const downloadLink = this.$refs.excelDownload.$el.querySelector('a');
      if (downloadLink) {
        downloadLink.click();
      } else {
        console.error("Không tìm thấy link tải xuống.");
      }
    },
    toggleRoomDetail(room){
      this.modals.roomDetailModal = true;
      this.selectedFile = null;
      this.modals.roomDetail = room
      console.log(this.modals.roomDetail)

      //get all student of room
      const token = localStorage.getItem("access_token");
      axios
        .get(API_URL+`/managements/${this.modals.roomDetail.code}/students/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.studentData = response.data
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Lấy danh sách học sinh lớp ${this.modals.roomDetail.name} thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    toggleSemesterDetail(code){
      this.semesterDetailStatus = false;
      this.roomDetailStatus = true;
      this.selectedSemester = code;
    },
    toggleRoomOptionDetail(room){
      this.roomDetailStatus = false;
      this.selectedRoomOption = room;
    },
    closeSemesterDetail() {
      this.selectedRoomOption = null;
      this.roomDetailStatus = true;
      this.optionSelected = null,
      this.selectedAction = null
    },
    viewClassList() {
      // Handle viewing the class list logic
      this.optionSelected = 1;
      this.selectedAction = "viewClassList"
      this.getStudentInRoom(this.selectedRoomOption.id)
      this.getRoomData();
    },
    getStudentInRoom(roomName){
      //get all student of room
      const token = localStorage.getItem("access_token");
      axios
        .get(API_URL+`/users/students/?room_id=${roomName}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(API_URL+`/users/students/?room_id=${roomName}`)
          this.studentData = response.data
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Lấy danh sách học sinh lớp ${roomName} thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    viewSchedule() {
      // Handle viewing the schedule logic
      this.optionSelected = 2;
      this.selectedAction = "viewSchedule"
      this.getSession();
      
    },
    getSession(){
      //get all student of room
      const token = localStorage.getItem("access_token");
      axios
        .get(API_URL+`/managements/sessions/?semester_code=${this.selectedSemester}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.lessons = response.data
          console.log(this.lessons)

        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: `Lấy thời khóa biểu thất bại`,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    assignTeachers() {
      // Handle assigning teachers logic
      alert("Phân công giáo viên");
    },
    async initializeData() {
        try {
          await this.getApiUrl();
          await this.getSemesterData();
          await this.getRoomData();
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
      getSemesterData() {
        if (this.semesters) return;
        const token = localStorage.getItem("access_token");

        axios
          .get(API_URL + "/managements/semesters/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.semesters = response.data;
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
          });
      },
      // async getPositionData(index) {
        
      //   const token = localStorage.getItem("access_token");
      //   try {
      //     // const response = await axios.get(`${API_URL}/rooms/${roomName}/allseatings/`, {
      //     const response = await axios.get(`${API_URL}/rooms/seating-positions/?room=${index}`, {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //         "Content-Type": "application/json",
      //       },
      //     });
      //     if (response.data.length === 0) {
      //       this.$notify({
      //         type: "warning",
      //         icon: 'tim-icons icon-bell-55',
      //         message: "Không tồn tại danh sách chỗ ngồi của lớp",
      //         timeout: 3000,
      //         verticalAlign: "bottom",
      //         horizontalAlign: "right",
      //       });
      //     } 
      //     else {
      //       this.seatingData = response.data;
      //     }
          
          
      //   } catch (error) {
      //     console.error("Error getting seating data:", error);
      //   }
      // },
      getRoomData() {
        if (this.rooms) return;
        const token = localStorage.getItem("access_token");

        axios
          // .get(API_URL + `/managements/rooms/?semester=${this.selectedSemester}/`, {
          .get(API_URL + `/managements/rooms/?academic_year=20242/`, {
          // .get(API_URL + `/managements/rooms/`, {
          
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.roomData = response.data;
          })
          .catch((error) => {
            console.error("Error getting room data:", error);
            this.$notify({
              type: "warning",
              icon: 'tim-icons icon-bell-55',
              message: "Lấy danh sách lớp học thất bại",
              timeout: 3000,
              verticalAlign: "top",
              horizontalAlign: "right",
            });
          });
      },
    removeObject(){
        const token = localStorage.getItem("access_token");

        let apiUrl = ""; // API URL sẽ thay đổi dựa trên loại đăng ký
        if (this.bigLineChart.activeIndex === 0) {
          apiUrl = API_URL + "/managements/semesters/" + this.modals.idRemove + "/";
        } else if (this.bigLineChart.activeIndex === 1) {
          apiUrl = API_URL + "/managements/time-slots/" + this.modals.idRemove + "/";
        } else if (this.bigLineChart.activeIndex === 2) {
          apiUrl = API_URL + "/managements/subjects/" + this.modals.idRemove + "/";
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
            message = "Xóa học kỳ thành công"
          } else if (this.bigLineChart.activeIndex === 1) {
            message = "Xóa tiết học thành công"
          } else if (this.bigLineChart.activeIndex === 2) {
            message = "Xóa môn học thành công"
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
          this.initBigChart(this.bigLineChart.activeIndex)
        })
        .catch((error) => {
          console.error("Error get user data :", error);

          this.$notify({
                type: "warning",
                message: "Xóa dữ liệu thất bại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    createObject(){
        let apiUrl = "";
        let data =null
        if(this.bigLineChart.activeIndex ===0 ){
          apiUrl = API_URL + `/managements/semesters/`
          data = this.modals.semesterCreate
        } else if (this.bigLineChart.activeIndex === 1) {
          apiUrl = API_URL + "/managements/time-slots/";
          data = this.modals.timeslotCreate
        } else if (this.bigLineChart.activeIndex === 2) {
          apiUrl = API_URL + "/managements/subjects/";
          data = this.modals.subjectCreate
        }

        console.log(data)
        const token = localStorage.getItem("access_token");
        axios
        .post(apiUrl, data, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let message = "";
          if (this.bigLineChart.activeIndex === 0) {
            message = "Thêm học kỳ thành công"
          } else if (this.bigLineChart.activeIndex === 1) {
            message = "Thêm tiết học thành công"
          } else if (this.bigLineChart.activeIndex === 2) {
            message = "Thêm môn học thành công"
          }

            this.$notify({
                type: "success",
                icon: 'tim-icons icon-check-2',
                message: message,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });

          this.modals.createModal = false
          this.initBigChart(this.bigLineChart.activeIndex)
        })
        .catch((error) => {
          console.error("Error create data :", error);
          if(error.response.status === 400 && this.bigLineChart.activeIndex === 0){
            this.$notify({
                type: "warning",
                message: "Ngày bắt đầu của học kỳ phải là thứ hai",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
          }
          else {
            this.$notify({
                type: "warning",
                message: "Thêm dữ liệu thất bại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
          }
        });
    },
    updateObject(){
        let data = null;
        let apiUrl = "";
        // const data = this.modals.studentDetail;

        if(this.bigLineChart.activeIndex ===0 ){
          apiUrl = API_URL + `/managements/semesters/${this.modals.semesterDetail.code}/`
          data = this.modals.semesterDetail
        }
         else if (this.bigLineChart.activeIndex === 1) {
          apiUrl = API_URL + "/managements/time-slots/" + this.modals.timeslotDetail.code + "/";
          data = this.modals.timeslotDetail
        } else if (this.bigLineChart.activeIndex === 2) {
          apiUrl = API_URL + "/managements/subjects/" + this.modals.subjectDetail.code + "/";
          data = this.modals.subjectDetail
        }
        const token = localStorage.getItem("access_token");
        axios
        .patch(apiUrl, data, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let message = "";
          if (this.bigLineChart.activeIndex === 0) {
            this.modals.semesterDetail = response.data
            message = "Cập nhật thông tin học kỳ thành công"
        
          } else if (this.bigLineChart.activeIndex === 1) {
            this.modals.plannedLessonDetail = response.data
            message = "Cập nhật thông tin tiết học thành công"
          } else if (this.bigLineChart.activeIndex === 2) {
            this.modals.plannedLessonDetail = response.data
            message = "Cập nhật thông tin môn học thành công"
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
          console.error("Error get data :", error);

          this.$notify({
                type: "warning",
                message: "Dữ liệu không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
     toggleSeatingDetail(){
      this.modals.seatingModal = true;
      this.getPositionData();
    },
    toggleCreate(){
      this.modals.createModal = true;
    },
    toggleUpdate(index){
        this.modals.updateModal = true;

        let apiUrl = ""; // API URL sẽ thay đổi dựa trên loại đăng ký
        if (this.bigLineChart.activeIndex === 0) {
          apiUrl = API_URL + "/managements/semesters/" + index + "/";
        }  else if (this.bigLineChart.activeIndex === 1) {
          apiUrl = API_URL + "/managements/time-slots/" + index + "/";
        } else if (this.bigLineChart.activeIndex === 2) {
          apiUrl = API_URL + "/managements/subjects/" + index + "/";
        }

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
            this.modals.semesterDetail = response.data
          }  else if (this.bigLineChart.activeIndex === 1) {
            this.modals.timeslotDetail = response.data
          } else if (this.bigLineChart.activeIndex === 2) {
            this.modals.subjectDetail = response.data
          }
        })
        .catch((error) => {
          console.error("Error get data :", error);

          this.$notify({
                type: "warning",
                message: "Dữ liệu không tồn tại. Vui lòng thử lại",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
    toggleRemove(index){
        this.modals.removeModal = true;
        this.modals.idRemove = index;
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
    
      let apiUrl = ""; 
      if (this.bigLineChart.activeIndex === 0) {
        apiUrl = API_URL + "/managements/semesters/";
      } else if (this.bigLineChart.activeIndex === 1) {
        apiUrl = API_URL + "/managements/time-slots/";
      } else if (this.bigLineChart.activeIndex === 2) {
        apiUrl = API_URL + "/managements/subjects/";
      } else if (this.bigLineChart.activeIndex === 4) {
        apiUrl = API_URL + "/adminpanel/grades/";
      }

      //Get data
      const token = localStorage.getItem("access_token");
      axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào headers
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if(this.bigLineChart.activeIndex === 0) this.semesterData = response.data
          else if(this.bigLineChart.activeIndex === 1) this.timeslotData = response.data
          else if(this.bigLineChart.activeIndex === 2) this.subjectData = response.data
          
        })
        .catch((error) => {
          console.error("Error get data :", error);

          this.$notify({
                type: "warning",
                message: "Lấy dữ liệu thất bại. Vui lòng thử lại sau",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
              });
        });
    },
  },
};
</script>

<style scoped>
.card-container {
  margin-top: 50px;
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
.semester-card {
  border-radius: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.semester-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.semester-card .card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.semester-card .card-footer button {
  width: 48%;
}

.add-card {
  background: #f8f9fa;
  border: 2px dashed #28a745;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-card:hover {
  background-color: #e9f7ec;
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.add-semester-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.btn-add {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-add:hover {
  background-color: #0056b3;
}

.btn-add i {
  margin-right: 8px;
}

.semester-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  /* background-color: #f9f9f9; */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  
  
  position: relative;
}

/* Nút quay lại */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #5a6268;
}

/* Tiêu đề học kỳ */
.semester-title {
  font-size: 36px;
  color: #65beed; /* Màu sắc tiêu đề */
  margin-bottom: 30px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng mờ để nổi bật */
}


/* Nhóm nút */
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

/* Các nút hành động */
.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

/* Màu sắc cho từng nút */
.action-card-blue {
  background-color: #007bff;
}

/* .action-card-blue:hover {
  background-color: #0056b3;
} */

.action-card-green {
  background-color: #28a745;
}

/* .action-card-green:hover {
  background-color: #218838;
} */

.action-card-red {
  background-color: #dc3545;
}

/* .action-card-red:hover {
  background-color: #c82333;
} */

/* Biểu tượng trong nút */
.icon {
  font-size: 36px;
  margin-bottom: 10px;
}

/* Văn bản trong nút */
.action-text {
  font-size: 16px;
  text-align: center;
}

/* Nút được chọn */
.action-card.active {
  transform: scale(0.95); /* Làm nhỏ nút */
  filter: brightness(0.6); /* Làm tối nút */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Giảm độ bóng */
}

/* Chuyển đổi trạng thái mượt */
.action-card {
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
}

/* Đổi màu nền và màu chữ cho lịch */
.vuecal {
  background-color: #ffffff; /* Nền trắng */
  color: #333333; /* Chữ tối */
}

/* Đổi màu tiêu đề tháng, tuần */
.vuecal__header,
.vuecal__title {
  background-color: #f0f0f0; /* Nền sáng hơn */
  color: #333333; /* Chữ tối */
}

/* Đổi màu ngày hiện tại */
.vuecal__current-day {
  background-color: #d0ebff; /* Nền xanh nhạt */
  color: #333333; /* Chữ tối */
}

/* Đổi màu các ngày đã chọn */
.vuecal__selected {
  background-color: #26dd6f; 
  color: #333333; /* Chữ tối */
}

.calendar-container {
  display: flex;
  gap: 16px;
  max-width: 900px; /* Tăng chiều rộng nếu cần */
  margin: auto; /* Căn giữa */
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  margin-bottom: 10px;
}
.calendar-grid {
  flex: 2; /* Dành nhiều không gian hơn cho lịch */
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Mỗi tuần 7 cột */
  gap: 4px; /* Khoảng cách giữa các ô */
}
.calendar-day {
  border: 1px solid #ddd;
  color: rgb(66, 174, 190);
  padding: 10px;
  text-align: center;
  position: relative;
  background-color: white;
  border-radius: 5px;
  
}
.calendar-day.header {
  font-weight: bold;
  background-color: #f4f4f4;
}
.current-day {
  background-color: #007bff;
  color: white;
}
.other-month {
  color: #aaa;
}
.event {
  margin-top: 5px;
  padding: 2px 5px;
  background-color: #28a745;
  color: white;
  border-radius: 3px;
  font-size: 12px;
}

.calendar-day.has-lesson {
  border: 2px solid #28a745;
  background-color: rgba(40, 167, 69, 0.1); /* Thêm nền để làm nổi bật */
  border-radius: 4px;
}

.calendar-day:hover {
  background-color: #28a745;; /* Thay đổi màu nền khi hover */
  color: #fff; /* Thay đổi màu chữ khi hover */
  cursor: pointer; /* Đổi con trỏ thành hình bàn tay */
}

.calendar-container {
  display: flex;
  gap: 16px;
}

.calendar-grid {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.lesson-list {
  flex: 1;
  padding: 16px;
  background: #f1f1f1; /* Thay đổi màu nền để sáng hơn */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem; /* Tăng kích thước chữ */
}

.lesson-list h3 {
  margin-bottom: 12px;
  font-size: 1.4rem; /* Tăng kích thước tiêu đề */
  color: #333; /* Thay đổi màu chữ */
}

.lesson-list ul {
  list-style: none;
  padding: 0;
}

.lesson-list li {
  padding: 5px; /* Tăng khoảng cách padding */
  background-color: #ffffff; /* Màu nền trắng */
  color: #333; /* Màu chữ đen */
  border: 1px solid #ddd; /* Thêm đường viền để nổi bật */
  border-radius: 8px;
  margin-bottom: 8px; /* Khoảng cách giữa các mục */
  font-weight: bold; /* Làm chữ đậm hơn */
}

.lesson-list li:hover {
  background-color: rgba(40, 167, 69, 0.1);; /* Thay đổi màu nền khi hover */
  color: #fff; /* Thay đổi màu chữ khi hover */
  cursor: pointer; /* Đổi con trỏ thành hình bàn tay */
  border: 2px solid #28a745;
}

.lesson-list li:last-child {
  border-bottom: none;
}

/* CSS thời khóa biểu mới */
.curriculum-timetable .timetable-title {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.curriculum-timetable .timetable-title h2 {
  color: #1e88e5;
  margin-bottom: 5px;
}

.curriculum-timetable .timetable-title p {
  color: #757575;
  margin: 0;
}

.curriculum-timetable .calendar-section {
  flex: 1.2;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.curriculum-timetable .month-title {
  font-weight: bold;
  font-size: 1.3rem;
  color: #333;
}

.curriculum-timetable .nav-button {
  background-color: #1e88e5;
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

.curriculum-timetable .nav-button:hover {
  background-color: #1565c0;
}

.curriculum-timetable .calendar-day {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 5px;
  min-height: 70px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  background-color: white;
}

.curriculum-timetable .calendar-day:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.curriculum-timetable .calendar-day.header {
  font-weight: bold;
  text-align: center;
  background-color: #f5f5f5;
  min-height: auto;
  padding: 10px;
  border: none;
  color: #616161;
}

.curriculum-timetable .calendar-day.current-day {
  background-color: #e3f2fd;
  border-color: #1e88e5;
}

.curriculum-timetable .calendar-day.other-month {
  color: #bdbdbd;
  background-color: #fafafa;
}

.curriculum-timetable .calendar-day.has-lesson {
  background-color: #e8f5e9;
  border-color: #43a047;
}

.curriculum-timetable .calendar-day.selected-day {
  background-color: #bbdefb;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px #1976d2;
}

.curriculum-timetable .day-number {
  position: absolute;
  top: 5px;
  left: 5px;
  font-weight: bold;
  font-size: 14px;
}

.curriculum-timetable .day-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.curriculum-timetable .lesson-dot {
  width: 6px;
  height: 6px;
  background-color: #43a047;
  border-radius: 50%;
}

.curriculum-timetable .calendar-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
}

.curriculum-timetable .calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.curriculum-timetable .calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  width: 100%;
}

.curriculum-timetable .lesson-list {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.curriculum-timetable .lesson-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.curriculum-timetable .lesson-header h3 {
  margin: 0;
  color: #1e88e5;
  font-size: 1.3rem;
}

.curriculum-timetable .lesson-content {
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 500px;
}

.curriculum-timetable .lesson-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.curriculum-timetable .lesson-list li {
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

.curriculum-timetable .lesson-list li:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.curriculum-timetable .lesson-time {
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

.curriculum-timetable .lesson-info {
  flex: 1;
}

.curriculum-timetable .lesson-subject {
  font-weight: bold;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
}

.curriculum-timetable .lesson-room {
  color: #757575;
  font-size: 14px;
}

.curriculum-timetable .empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #9e9e9e;
  text-align: center;
}

.curriculum-timetable .empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
}

.curriculum-timetable .empty-state p {
  font-size: 16px;
}

.curriculum-timetable .add-session-button {
  text-align: center;
  margin-top: 20px;
}

.curriculum-timetable .btn-add-session {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.curriculum-timetable .btn-add-session i {
  margin-right: 8px;
}

.curriculum-timetable .btn-add-session:hover {
  background-color: #388e3c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .curriculum-timetable .calendar-container {
    flex-direction: column;
  }
  
  .curriculum-timetable .calendar-section, 
  .curriculum-timetable .lesson-list {
    width: 100%;
  }
  
  .curriculum-timetable .lesson-list {
    margin-top: 20px;
  }
}
</style>