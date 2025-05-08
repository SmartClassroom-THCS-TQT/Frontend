<template>
  <div class="row">
    <div class="col-12">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-md-5">
              <h3>Tổng kết tuần học {{ weekSelected ? " - Tuần " + weekSelected : "" }}</h3>
            </div>
            <div class="col-md-7">
              <div class="row">
                <div class="col-md-3 pr-md-1 text-center">
                  <base-input label="Học kỳ">
                    <select class="btn btn-simple btn-sm btn-gay" v-model="semesterSelected" @change="onSemesterChange">
                      <option class="text-info" v-for="semester in semesters" :key="semester.code" :value="semester.code">{{ semester.code }}</option>
                    </select>
                  </base-input>
                </div>
                <div class="col-md-3 pr-md-1 text-center">
                  <base-input label="Tuần">
                    <select class="btn btn-simple btn-sm btn-gay" v-model="weekSelected" @change="getWeeklyReports">
                      <option class="text-info" v-for="week in weeks" :key="week" :value="week">{{ week }}</option>
                    </select>
                  </base-input>
                </div>
                <div class="col-md-3 pl-md-1 text-center">
                  <base-button 
                    class="btn btn-sm"
                    @click="getWeeklyReports"
                    fill
                  >Lọc
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Lớp</th>
                <th>Giáo viên chủ nhiệm</th>
                <th>Năm học</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="room in rooms" :key="room.id">
                <td>{{ room.name }}</td>
                <td>{{ room.manager.full_name }}</td>
                <td>{{ room.academic_year.year_name }}</td>
                <td>
                  <base-button
                    type="success"
                    size="sm"
                    @click="showRoomReport(room)"
                  >
                    Xem báo cáo
                  </base-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>

      <!-- Modal for showing room report -->
      <modal :show.sync="showReportModal" :show-close="true" modal-classes="modal-xl">
        <template slot="header">
          <h3 class="modal-title font-weight-bold">Báo cáo tuần học - lớp {{ selectedRoom?.name }}</h3>
      
        </template>
        <div style="display: flex; justify-content: center; align-items: center;">
                <div v-if="timetableData">
                    <div id="tableDiv">
                        <table class="table-bordered" style="width: 1200px">
                            <tbody>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;">Thứ</td>
                                    <td style="width: 29px; height: 62px;">Tiết</td>
                                    <td style="width: 120px; height: 62px;">Môn học</td>
                                    <td style="width: 50px; height: 62px;">Tiết theo PPCT</td>
                                    <td style="width: 160px; height: 62px;">Số học sinh nghỉ</td>
                                    <td style="width: 230px; height: 62px;">Tên bài, nội dung công việc</td>
                                    <td style="width: 280px; height: 62px;">Nhận xét của giáo viên</td>
                                    <td style="width: 100px; height: 62px;">Xếp loại tiết học</td>
                                    <td style="width: 100px; height: 62px;">Ký tên</td>
                                </tr>
                                
                                
                                
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 310.333px;" rowspan="6">
                                        <p class="font-weight-bold">Thứ Hai</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].monday?this.timetableData[0].monday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].monday? this.timetableData[0].monday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[0].monday && this.absentListMap[this.timetableData[0].monday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].monday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].monday && this.timetableData[0].monday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].monday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].monday? this.timetableData[0].monday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].monday? this.timetableData[0].monday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].monday? this.timetableData[0].monday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62.3333px;">
                                    <td style="width: 29px; height: 62.3333px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].monday?this.timetableData[1].monday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].monday? this.timetableData[1].monday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[1].monday && this.absentListMap[this.timetableData[1].monday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].monday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].monday && this.timetableData[1].monday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].monday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].monday? this.timetableData[1].monday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].monday? this.timetableData[1].monday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].monday? this.timetableData[1].monday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].monday?this.timetableData[2].monday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].monday? this.timetableData[2].monday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[2].monday && this.absentListMap[this.timetableData[2].monday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[2].monday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[2].monday && this.timetableData[2].monday.absences > 0" class="text-danger">
                                            {{this.timetableData[2].monday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[2].monday? this.timetableData[2].monday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].monday? this.timetableData[2].monday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].monday? this.timetableData[2].monday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].monday? this.timetableData[2].monday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].monday?this.timetableData[3].monday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].monday? this.timetableData[3].monday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[3].monday && this.absentListMap[this.timetableData[3].monday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[3].monday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[3].monday && this.timetableData[3].monday.absences > 0" class="text-danger">
                                            {{this.timetableData[3].monday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[3].monday? this.timetableData[3].monday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].monday? this.timetableData[3].monday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].monday? this.timetableData[3].monday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].monday? this.timetableData[3].monday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].monday?this.timetableData[4].monday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].monday? this.timetableData[4].monday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[4].monday && this.absentListMap[this.timetableData[4].monday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[4].monday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[4].monday && this.timetableData[4].monday.absences > 0" class="text-danger">
                                            {{this.timetableData[4].monday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[4].monday? this.timetableData[4].monday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].monday? this.timetableData[4].monday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].monday? this.timetableData[4].monday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].monday? this.timetableData[4].monday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].monday?this.timetableData[5].monday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].monday? this.timetableData[5].monday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[5].monday && this.absentListMap[this.timetableData[5].monday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].monday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].monday && this.timetableData[5].monday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].monday.absences}} 
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].monday? this.timetableData[5].monday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].monday? this.timetableData[5].monday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].monday? this.timetableData[5].monday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].monday? this.timetableData[5].monday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                
                                
                                
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p class="font-weight-bold" >Thứ Ba</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].tuesday?this.timetableData[0].tuesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].tuesday? this.timetableData[0].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[0].tuesday && this.absentListMap[this.timetableData[0].tuesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].tuesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].tuesday && this.timetableData[0].tuesday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].monday.absences}} 
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[0].tuesday? this.timetableData[0].tuesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].tuesday? this.timetableData[0].tuesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].tuesday? this.timetableData[0].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].tuesday? this.timetableData[0].tuesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].tuesday?this.timetableData[1].tuesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.lesson_number: "" }}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[1].tuesday && this.absentListMap[this.timetableData[1].tuesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].tuesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].tuesday && this.timetableData[1].tuesday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].tuesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[1].tuesday? this.timetableData[1].tuesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].tuesday?this.timetableData[2].tuesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[2].tuesday && this.absentListMap[this.timetableData[2].tuesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[2].tuesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[2].tuesday && this.timetableData[2].tuesday.absences > 0" class="text-danger">
                                            {{this.timetableData[2].tuesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[2].tuesday? this.timetableData[2].tuesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].tuesday?this.timetableData[3].tuesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[3].tuesday && this.absentListMap[this.timetableData[3].tuesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[3].tuesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[3].tuesday && this.timetableData[3].tuesday.absences > 0" class="text-danger">
                                            {{this.timetableData[3].tuesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[3].tuesday? this.timetableData[3].tuesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].tuesday?this.timetableData[4].tuesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[4].tuesday && this.absentListMap[this.timetableData[4].tuesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[4].tuesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[4].tuesday && this.timetableData[4].tuesday.absences > 0" class="text-danger">
                                            {{this.timetableData[4].tuesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[4].tuesday? this.timetableData[4].tuesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.lesson_name: "" }}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].tuesday?this.timetableData[5].tuesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[5].tuesday && this.absentListMap[this.timetableData[5].tuesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].tuesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].tuesday && this.timetableData[5].tuesday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].tuesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].tuesday? this.timetableData[5].tuesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                
                                
                                
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p class="font-weight-bold">Thứ Tư</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].wednesday?this.timetableData[0].wednesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[0].wednesday && this.absentListMap[this.timetableData[0].wednesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].wednesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].wednesday && this.timetableData[0].wednesday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].wednesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[0].wednesday? this.timetableData[0].wednesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].wednesday?this.timetableData[1].wednesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[1].wednesday && this.absentListMap[this.timetableData[1].wednesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].wednesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].wednesday && this.timetableData[1].wednesday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].wednesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[1].wednesday? this.timetableData[1].wednesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].wednesday?this.timetableData[2].wednesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.lesson_number: ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[2].wednesday && this.absentListMap[this.timetableData[2].wednesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[2].wednesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[2].wednesday && this.timetableData[2].wednesday.absences > 0" class="text-danger">
                                            {{this.timetableData[2].wednesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[2].wednesday? this.timetableData[2].wednesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].wednesday?this.timetableData[3].wednesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[3].wednesday && this.absentListMap[this.timetableData[3].wednesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[3].wednesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[3].wednesday && this.timetableData[3].wednesday.absences > 0" class="text-danger">
                                            {{this.timetableData[3].wednesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[3].wednesday? this.timetableData[3].wednesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].wednesday?this.timetableData[4].wednesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[4].wednesday && this.absentListMap[this.timetableData[4].wednesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[4].wednesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[4].wednesday && this.timetableData[4].wednesday.absences > 0" class="text-danger">
                                            {{this.timetableData[4].wednesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[4].wednesday? this.timetableData[4].wednesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].wednesday?this.timetableData[5].wednesday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[5].wednesday && this.absentListMap[this.timetableData[5].wednesday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].wednesday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].wednesday && this.timetableData[5].wednesday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].wednesday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].wednesday? this.timetableData[5].wednesday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                
                                
                                
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p class="font-weight-bold">Thứ Năm</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].thursday?this.timetableData[0].thursday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[0].thursday && this.absentListMap[this.timetableData[0].thursday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].thursday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].thursday && this.timetableData[0].thursday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].thursday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[0].thursday? this.timetableData[0].thursday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].thursday?this.timetableData[1].thursday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[1].thursday && this.absentListMap[this.timetableData[1].thursday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].thursday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].thursday && this.timetableData[1].thursday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].thursday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[1].thursday? this.timetableData[1].thursday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].thursday?this.timetableData[2].thursday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[2].thursday && this.absentListMap[this.timetableData[2].thursday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[2].thursday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[2].thursday && this.timetableData[2].thursday.absences > 0" class="text-danger">
                                            {{this.timetableData[2].thursday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[2].thursday? this.timetableData[2].thursday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].thursday?this.timetableData[3].thursday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[3].thursday && this.absentListMap[this.timetableData[3].thursday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[3].thursday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[3].thursday && this.timetableData[3].thursday.absences > 0" class="text-danger">
                                            {{this.timetableData[3].thursday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[3].thursday? this.timetableData[3].thursday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].thursday?this.timetableData[4].thursday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[4].thursday && this.absentListMap[this.timetableData[4].thursday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[4].thursday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[4].thursday && this.timetableData[4].thursday.absences > 0" class="text-danger">
                                            {{this.timetableData[4].thursday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[4].thursday? this.timetableData[4].thursday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].thursday?this.timetableData[5].thursday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[5].thursday && this.absentListMap[this.timetableData[5].thursday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].thursday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].thursday && this.timetableData[5].thursday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].thursday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].thursday? this.timetableData[5].thursday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                
                                
                                
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 310.333px;" rowspan="6">
                                        <p class="font-weight-bold">Thứ Sáu</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].friday?this.timetableData[0].friday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[0].friday && this.absentListMap[this.timetableData[0].friday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].friday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].friday && this.timetableData[0].friday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].friday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62.3333px;">
                                    <td style="width: 29px; height: 62.3333px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].friday?this.timetableData[1].friday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[1].friday && this.absentListMap[this.timetableData[1].friday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].friday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].friday && this.timetableData[1].friday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].friday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].friday?this.timetableData[2].friday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[2].friday && this.absentListMap[this.timetableData[2].friday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[2].friday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[2].friday && this.timetableData[2].friday.absences > 0" class="text-danger">
                                            {{this.timetableData[2].friday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[2].friday? this.timetableData[2].friday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].friday?this.timetableData[3].friday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[3].friday && this.absentListMap[this.timetableData[3].friday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[3].friday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[3].friday && this.timetableData[3].friday.absences > 0" class="text-danger">
                                            {{this.timetableData[3].friday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[3].friday? this.timetableData[3].friday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].friday?this.timetableData[4].friday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[4].friday && this.absentListMap[this.timetableData[4].friday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[4].friday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[4].friday && this.timetableData[4].friday.absences > 0" class="text-danger">
                                            {{this.timetableData[4].friday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[4].friday? this.timetableData[4].friday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].friday?this.timetableData[5].friday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[5].friday && this.absentListMap[this.timetableData[5].friday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].friday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].friday && this.timetableData[5].friday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].friday.absences}} 
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].friday? this.timetableData[5].friday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                
                                
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 310.333px;" rowspan="6">
                                        <p class="font-weight-bold">Thứ Bảy</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].saturday?this.timetableData[0].saturday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[0].saturday && this.absentListMap[this.timetableData[0].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].saturday && this.timetableData[0].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].saturday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62.3333px;">
                                    <td style="width: 29px; height: 62.3333px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].saturday?this.timetableData[1].saturday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[1].saturday && this.absentListMap[this.timetableData[1].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].saturday && this.timetableData[1].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].saturday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].saturday?this.timetableData[2].saturday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[2].saturday && this.absentListMap[this.timetableData[2].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[2].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[2].saturday && this.timetableData[2].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[2].saturday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[2].saturday? this.timetableData[2].saturday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].saturday?this.timetableData[3].saturday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].saturday? this.timetableData[3].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[3].saturday && this.absentListMap[this.timetableData[3].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[3].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[3].saturday && this.timetableData[3].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[3].saturday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[3].saturday? this.timetableData[3].saturday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].saturday? this.timetableData[3].saturday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].saturday? this.timetableData[3].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].saturday? this.timetableData[3].saturday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].saturday?this.timetableData[4].saturday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].saturday? this.timetableData[4].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[4].saturday && this.absentListMap[this.timetableData[4].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[4].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[4].saturday && this.timetableData[4].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[4].saturday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[4].saturday? this.timetableData[4].saturday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].saturday? this.timetableData[4].saturday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].saturday? this.timetableData[4].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].saturday? this.timetableData[4].saturday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].saturday?this.timetableData[5].saturday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].saturday? this.timetableData[5].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[5].saturday && this.absentListMap[this.timetableData[5].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].saturday && this.timetableData[5].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].saturday.absences}} 
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].saturday? this.timetableData[5].saturday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].saturday? this.timetableData[5].saturday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].saturday? this.timetableData[5].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].saturday? this.timetableData[5].saturday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                
                                
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 310.333px;" rowspan="6">
                                        <p class="font-weight-bold">Chủ Nhật</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].sunday?this.timetableData[0].sunday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].sunday? this.timetableData[0].sunday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[0].sunday && this.absentListMap[this.timetableData[0].sunday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].sunday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].sunday && this.timetableData[0].sunday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].sunday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].sunday? this.timetableData[0].sunday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].sunday? this.timetableData[0].sunday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].sunday? this.timetableData[0].sunday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62.3333px;">
                                    <td style="width: 29px; height: 62.3333px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].sunday?this.timetableData[1].sunday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].sunday? this.timetableData[1].sunday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[1].sunday && this.absentListMap[this.timetableData[1].sunday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].sunday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].sunday && this.timetableData[1].sunday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].sunday.absences}} học sinh vắng
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].sunday? this.timetableData[1].sunday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].sunday? this.timetableData[1].sunday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].sunday? this.timetableData[1].sunday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].sunday?this.timetableData[2].sunday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].sunday? this.timetableData[2].sunday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[2].sunday && this.absentListMap[this.timetableData[2].sunday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[2].sunday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[2].sunday && this.timetableData[2].sunday.absences > 0" class="text-danger">
                                            {{this.timetableData[2].sunday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[2].sunday? this.timetableData[2].sunday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].sunday? this.timetableData[2].sunday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].sunday? this.timetableData[2].sunday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].sunday? this.timetableData[2].sunday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].sunday?this.timetableData[3].sunday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].sunday? this.timetableData[3].sunday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[3].sunday && this.absentListMap[this.timetableData[3].sunday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[3].sunday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[3].sunday && this.timetableData[3].sunday.absences > 0" class="text-danger">
                                            {{this.timetableData[3].sunday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[3].sunday? this.timetableData[3].sunday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].sunday? this.timetableData[3].sunday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].sunday? this.timetableData[3].sunday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].sunday? this.timetableData[3].sunday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].sunday?this.timetableData[4].sunday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].sunday? this.timetableData[4].sunday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[4].sunday && this.absentListMap[this.timetableData[4].sunday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[4].sunday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[4].sunday && this.timetableData[4].sunday.absences > 0" class="text-danger">
                                            {{this.timetableData[4].sunday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[4].sunday? this.timetableData[4].sunday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].sunday? this.timetableData[4].sunday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].sunday? this.timetableData[4].sunday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].sunday? this.timetableData[4].sunday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].sunday?this.timetableData[5].sunday.subject_code.name : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].sunday? this.timetableData[5].sunday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" class="absence-cell">
                                        <div v-if="this.timetableData[5].sunday && this.absentListMap[this.timetableData[5].sunday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].sunday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].sunday && this.timetableData[5].sunday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].sunday.absences}} 
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].sunday? this.timetableData[5].sunday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].sunday? this.timetableData[5].sunday.lesson_name : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].sunday? this.timetableData[5].sunday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].sunday? this.timetableData[5].sunday.grade : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> 
      </modal>

    </div>
  </div>
</template>

<script>
import { Card, BaseButton, BaseInput, Modal } from "@/components";
import axios from "@/services/axios";

export default {
  components: {
    Card,
    BaseButton,
    BaseInput,
    Modal
  },
  data() {
    return {
      API_URL: "",
      rooms: [],
      allSessions: [], // Store all sessions for the selected semester and week
      weekSelected: null,
      semesterSelected: null,
      semesters: [],
      weeks: [],
      showReportModal: false,
      selectedRoom: null,
      timetableData: null,
      absentListMap: {},
      currentWeek: null,
      loading: false
      // Remove modal related properties
    };
  },
  async created() {
    this.API_URL = this.$t("dashboard.apiURL") || "";
    try {
      this.loading = true;
      await this.getSemesters();
      await this.getCurrentSemesterAndWeek();
      await this.getRooms();
      await this.getAllSessions();
      this.loading = false;
    } catch (error) {
      console.error("Error during initialization:", error);
      this.loading = false;
      this.$notify({
        type: 'danger',
        icon: 'tim-icons icon-alert-circle-exc',
        message: "Lỗi khởi tạo dữ liệu: " + error.message,
        timeout: 3000,
        verticalAlign: 'top',
        horizontalAlign: 'center',
      });
    }
  },
  methods: {
    async getSemesters() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("/managements/semesters/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        this.semesters = response.data;
      } catch (error) {
        console.error("Error fetching semesters:", error);
        this.$notify({
          type: 'danger',
          icon: 'tim-icons icon-alert-circle-exc',
          message: "Lấy danh sách học kỳ thất bại",
          timeout: 3000,
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
      }
    },
    async getCurrentSemesterAndWeek() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`/managements/check-semester/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const currentSemester = response.data;
        this.semesterSelected = currentSemester.semester;
        this.currentWeek = currentSemester.current_week;
        this.weekSelected = this.currentWeek;
        
        // Fetch the complete semester information to get the weeks_count
        await this.updateWeekOptions();
      } catch (error) {
        console.error("Error getting current semester:", error);
        this.$notify({
          type: 'danger',
          icon: 'tim-icons icon-alert-circle-exc',
          message: "Lấy thông tin học kỳ hiện tại thất bại",
          timeout: 3000,
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
      }
    },
    async updateWeekOptions() {
      try {
        if (!this.semesterSelected) return;
        
        const selectedSemester = this.semesters.find(s => s.code === this.semesterSelected);
        
        if (selectedSemester && selectedSemester.weeks_count) {
          this.generateWeekOptions(selectedSemester.weeks_count);
        } else {
          const token = localStorage.getItem("access_token");
          const response = await axios.get(`/managements/semesters/?code=${this.semesterSelected}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          });
          
          if (response.data && response.data.length > 0) {
            const semester = response.data[0];
            this.generateWeekOptions(semester.weeks_count || 15);
          } else {
            this.generateWeekOptions(15);
          }
        }
      } catch (error) {
        console.error("Error updating week options:", error);
        this.generateWeekOptions(15);
      }
    },
    generateWeekOptions(weekCount) {
      const arr = [];
      for (let i = 1; i <= weekCount; i++) {
        arr.push(i);
      }
      this.weeks = arr;
    },
    async getRooms() {
      try {
        const response = await axios.get("/managements/rooms/");
        this.rooms = response.data;
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // Remove this notification to reduce the number of notifications
        // this.$notify({
        //   type: 'danger',
        //   icon: 'tim-icons icon-alert-circle-exc',
        //   message: "Lấy danh sách lớp học thất bại",
        //   timeout: 3000,
        //   verticalAlign: 'top',
        //   horizontalAlign: 'center',
        // });
      }
    },
    async getAllSessions() {
      try {
        this.loading = true;
        if (!this.semesterSelected || !this.weekSelected) {
          throw new Error("Chưa chọn học kỳ hoặc tuần");
        }
        
        const selectedSemester = this.semesters.find(s => s.code === this.semesterSelected);
        let startDate, endDate;
        
        if (selectedSemester && selectedSemester.start_date) {
          const dates = this.calculateWeekDates(selectedSemester.start_date, this.weekSelected);
          startDate = dates.startDate;
          endDate = dates.endDate;
        } else {
          // Get semester details if not available
          const token = localStorage.getItem("access_token");
          const semesterResponse = await axios.get(`/managements/semesters/?code=${this.semesterSelected}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          });
          
          if (semesterResponse.data && semesterResponse.data.length > 0) {
            const semester = semesterResponse.data[0];
            if (semester.start_date) {
              const dates = this.calculateWeekDates(semester.start_date, this.weekSelected);
              startDate = dates.startDate;
              endDate = dates.endDate;
            } else {
              throw new Error("Không tìm thấy ngày bắt đầu của học kỳ");
            }
          } else {
            throw new Error("Không tìm thấy thông tin học kỳ");
          }
        }
        
        // Now fetch all sessions for this semester and date range
        const token = localStorage.getItem("access_token");
        // Use the date range in the API query - use exact date range with __gte and __lte
        const api = `/managements/sessions/?semester_code__code=${this.semesterSelected}&day__gte=${startDate}&day__lte=${endDate}`;
        
        console.log(`Fetching sessions for semester ${this.semesterSelected}, week ${this.weekSelected}, dates ${startDate} to ${endDate}`);
        
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        // Clear previous data
        this.allSessions = [];
        
        // Only include sessions within the exact date range
        this.allSessions = response.data.filter(session => {
          const sessionDate = new Date(session.day);
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          
          // Ensure the session date is within the week's range (inclusive)
          return sessionDate >= startDateObj && sessionDate <= endDateObj;
        });
        
        console.log(`Retrieved ${this.allSessions.length} sessions for week ${this.weekSelected}`);
        
        // Removing notification to reduce the number of notifications
        // this.$notify({
        //   type: "success",
        //   icon: 'tim-icons icon-bell-55',
        //   message: `Đã tải ${this.allSessions.length} tiết học của tuần ${this.weekSelected}`,
        //   timeout: 3000,
        //   verticalAlign: "top",
        //   horizontalAlign: "right",
        // });
        
        this.loading = false;
        
      } catch (error) {
        this.loading = false;
        console.error("Error fetching all sessions:", error);
        this.$notify({
          type: "danger",
          icon: 'tim-icons icon-alert-circle-exc',
          message: "Lỗi khi tải dữ liệu tiết học: " + error.message,
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "center",
        });
      }
    },
    onSemesterChange() {
      this.updateWeekOptions();
      this.weekSelected = 1; // Reset to first week when semester changes
      this.getAllSessions(); // Reload sessions for new semester and week
    },
    async getWeeklyReports() {
      // When filters change, reload all sessions
      this.timetableData = null; // Clear existing timetable data
      this.absentListMap = {}; // Clear existing absent data
      this.showReportModal = false; // Close any open report modal
      
      await this.getAllSessions();
      
      // If a room is already selected, refresh the report
      // Commenting out the line below to prevent auto-opening the report
      // if (this.selectedRoom) {
      //   this.showRoomReport(this.selectedRoom);
      // }
      
      this.$notify({
        type: "success",
        icon: 'tim-icons icon-bell-55',
        message: "Đã lọc danh sách lớp theo học kỳ " + this.semesterSelected + ", tuần " + this.weekSelected,
        timeout: 3000,
        verticalAlign: "top",
        horizontalAlign: "right",
      });
    },
    showRoomReport(room) {
      this.selectedRoom = room;
      this.showReportModal = true;
      
      // Reset data structures
      this.timetableData = this.initializeTimetableData();
      this.absentListMap = {};
      
      // Filter sessions for this room from the current week's data only
      const roomSessions = this.allSessions.filter(session => 
        session.room_id && session.room_id.id === room.id
      );
      
      console.log(`Filtering sessions for room ${room.id} (${room.name}) in week ${this.weekSelected}: found ${roomSessions.length} sessions`);
      
      if (roomSessions.length === 0) {
        // Remove notification for no data to reduce notifications
        // this.$notify({
        //   type: "warning",
        //   icon: 'tim-icons icon-alert-circle-exc',
        //   message: "Không tìm thấy dữ liệu tiết học của lớp " + room.name + " trong tuần " + this.weekSelected,
        //   timeout: 3000,
        //   verticalAlign: "top",
        //   horizontalAlign: "right",
        // });
        
        // Just process empty data
        this.formatTimetableData([]);
      } else {
        // Process and display the sessions
        this.formatTimetableData(roomSessions);
        
        // Keep this notification as it's important to inform the user when a report is successfully loaded
        this.$notify({
          type: "success",
          icon: 'tim-icons icon-bell-55',
          message: "Đã tải báo cáo lớp " + room.name + ", tuần " + this.weekSelected,
          timeout: 3000,
          verticalAlign: "top",
          horizontalAlign: "right",
        });
      }
    },
    calculateWeekDates(semesterStartDateStr, weekNumber) {
      const semesterStartDate = new Date(semesterStartDateStr);
      
      // Calculate the start of the selected week
      const startOfWeek = new Date(semesterStartDate);
      startOfWeek.setDate(semesterStartDate.getDate() + (weekNumber - 1) * 7);
      
      // Calculate the end of the selected week (6 days later)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return {
        startDate: this.formatDate(startOfWeek),
        endDate: this.formatDate(endOfWeek)
      };
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    initializeTimetableData() {
      // Create a data structure for the timetable with all days initialized
      return Array.from({ length: 6 }, (_, index) => ({
        period: index + 1,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      }));
    },
    formatTimetableData(sessions) {
      console.log("Formatting timetable data from sessions:", sessions);
      
      // Reset the absent list map
      this.absentListMap = {};
      
      // Initialize timetable data structure
      this.timetableData = this.initializeTimetableData();
      
      // Organize the sessions by day and period
      sessions.forEach(session => {
        try {
          const day = this.getDayOfWeek(session.day);
          const dayName = this.getDayName(day);
          const periodIndex = session.time_slot.code - 1;
          
          console.log(`Processing session: day=${dayName}, period=${periodIndex+1}, subject=${session.subject_code?.name}`);
          
          if (periodIndex >= 0 && periodIndex < 6) {
            // Make sure we're properly setting this property
            this.$set(this.timetableData[periodIndex], dayName, session);
            
            // If there are absences, fetch the list of absent students
            if (session.absences && session.absences > 0) {
              this.fetchAbsentStudents(session);
            }
          }
        } catch (error) {
          console.error("Error processing session:", session, error);
        }
      });
      
      console.log("Timetable data after formatting:", JSON.parse(JSON.stringify(this.timetableData)));
      return this.timetableData;
    },
    getDayOfWeek(dateString) {
      try {
        const date = new Date(dateString);
        const day = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
        return day === 0 ? 6 : day - 1; // Convert to 0 = Monday, 6 = Sunday
      } catch (error) {
        console.error("Error parsing date:", dateString, error);
        return 0; // Default to Monday on error
      }
    },
    getDayName(day) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      return days[day] || 'monday'; // Default to monday if invalid day
    },
    getDayNameVN(day) {
      switch (day) {
        case 0: return 'Thứ Hai';
        case 1: return 'Thứ Ba';
        case 2: return 'Thứ Tư';
        case 3: return 'Thứ Năm';
        case 4: return 'Thứ Sáu';
        case 5: return 'Thứ Bảy';
        default: return 'Chủ nhật';
      }
    },
    fetchAbsentStudents(lesson) {
      if (!lesson || !lesson.id || !lesson.absences || lesson.absences <= 0) return;
      
      try {
        const token = localStorage.getItem("access_token");
        axios.get(`/rooms_managements/attendances/?status=false&session=${lesson.id}&q={student{account,full_name}}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(response => {
          // Use $set to ensure Vue updates the UI
          this.$set(this.absentListMap, lesson.id, response.data);
        })
        .catch(error => {
          console.error("Error fetching absent student list:", error);
        });
      } catch (error) {
        console.error("Error in fetchAbsentStudents:", error);
      }
    },
  }
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

.absence-cell {
  cursor: pointer;
  max-height: 100px;
  overflow-y: auto;
}

.absence-cell:hover {
  background-color: #f8f9fa;
}

.absent-student-name {
  font-size: 12px;
  margin-bottom: 2px;
  line-height: 1.2;
}

.text-danger {
  color: #dc3545;
}

/* Make all table text black */
table td, 
table th,
table div,
table p,
table span {
  color: black !important;
}

/* Make modal wider */
:deep(.modal-xl) {
  max-width: 98%;
  width: 98%;
  margin: 10px auto;
}

/* Fix modal positioning */
:deep(.modal-dialog) {
  margin-top: 20px;
}

:deep(.modal-body) {
  padding-top: 0;
  overflow: visible !important;
  max-height: none !important;
  height: auto !important;
}

:deep(.modal-content) {
  overflow: visible !important;
}

:deep(.modal-header) {
  padding-bottom: 0;
}

/* Remove modal scrollbar */
#tableDiv {
  overflow: visible !important;
}
</style> 