<template>
    
    <div class="row">
      <div class="col-12">
        <!-- <div class="wrapper study"> -->
        <card>
            <template slot="header">
                <div class="row">
                    <div class="col-md-5">
                    <h3>Kết quả tuần học lớp {{ room.name }} {{ semesterSelected ? " - "+semesterSelected.semester : "" }} {{ weekSelected ? " - Tuần "+ weekData : "" }} </h3>
                    </div>
                    <div class="col-md-7">
                    <div class="row">
                        <div class="col-md-3 pr-md-1 text-center">
                        <!-- <base-input label="Học kỳ">
                            <select class="btn btn-simple btn-sm btn-success" v-model="semesterSelected" @change="getWeekData">
                            <option class="text-info" v-for="(semester, index) in semesters" :key="index" :value="semester">{{ semester.code }}</option>
                            </select>
                        </base-input> -->
                        </div>
                        <div class="col-md-3 pr-md-1 text-center">
                        <base-input label="Tuần">
                            <select class="btn btn-simple btn-sm btn-success" v-model="weekSelected" @change="takeWeekData">
                            <option class="text-info" v-for="week in weeks" :key="week" :value="week" >{{ week }}</option>
                            </select>
                        </base-input>
                        </div>
                        <div class="col-md-3 pl-md-1 text-center">
                        <base-button 
                            class="btn btn-sm "
                            @click="getTimeTable"
                            fill
                        >Lọc
                        </base-button>
                        </div>
                    </div>
                    </div>
                </div>
            </template>
            <div style="display: flex; justify-content: center; align-items: center;">
                <div v-if="timetableData">
                    <div  id="tableDiv">
                        <table class="table-bordered" style="width: 863px">
                            <tbody>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;">Thứ</td>
                                    <td style="width: 29px; height: 62px;">Tiết</td>
                                    <td style="width: 81px; height: 62px;">Môn học</td>
                                    <td style="width: 10px; height: 62px;">Tiết theo PPCT</td>
                                    <td style="width: 125px; height: 62px;">Số học sinh nghỉ</td>
                                    <td style="width: 173px; height: 62px;">Tên bài, nội dung công việc</td>
                                    <td style="width: 226px; height: 62px;">Nhận xét của giáo viên</td>
                                    <td style="width: 53px; height: 62px;">Xếp loại tiết học</td>
                                    <td style="width: 58px; height: 62px;">Ký tên</td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 310.333px;" rowspan="6">
                                        <p>Thứ Hai</p>
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
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[0].monday)" class="absence-cell">
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
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[1].monday)" class="absence-cell">
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
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[2].monday)" class="absence-cell">
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
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[3].monday)" class="absence-cell">
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
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[4].monday)" class="absence-cell">
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
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[5].monday)" class="absence-cell">
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
                                        <p>Thứ Ba</p>
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
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[0].tuesday)" class="absence-cell">
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
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.getNameSubject(this.timetableData[1].tuesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.lesson_number: "" }}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[1].tuesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].tuesday? this.timetableData[1].tuesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.getNameSubject(this.timetableData[2].tuesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[2].tuesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].tuesday? this.timetableData[2].tuesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.getNameSubject(this.timetableData[3].tuesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[3].tuesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].tuesday? this.timetableData[3].tuesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.getNameSubject(this.timetableData[4].tuesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[4].tuesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.name_lesson: "" }}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].tuesday? this.timetableData[4].tuesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.getNameSubject(this.timetableData[5].tuesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[5].tuesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].tuesday? this.timetableData[5].tuesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p>Thứ Tư</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.getNameSubject(this.timetableData[0].wednesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[0].wednesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].wednesday? this.timetableData[0].wednesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.getNameSubject(this.timetableData[1].wednesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[1].wednesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].wednesday? this.timetableData[1].wednesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.getNameSubject(this.timetableData[2].wednesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.lesson_number: ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[2].wednesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].wednesday? this.timetableData[2].wednesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.getNameSubject(this.timetableData[3].wednesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[3].wednesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].wednesday? this.timetableData[3].wednesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.getNameSubject(this.timetableData[4].wednesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[4].wednesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].wednesday? this.timetableData[4].wednesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.getNameSubject(this.timetableData[5].wednesday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[5].wednesday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].wednesday? this.timetableData[5].wednesday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p>Thứ Năm</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].thursday? this.getNameSubject(this.timetableData[0].thursday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[0].thursday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].thursday? this.timetableData[0].thursday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].thursday? this.getNameSubject(this.timetableData[1].thursday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[1].thursday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].thursday? this.timetableData[1].thursday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].thursday? this.getNameSubject(this.timetableData[2].thursday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[2].thursday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].thursday? this.timetableData[2].thursday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].thursday? this.getNameSubject(this.timetableData[3].thursday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[3].thursday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].thursday? this.timetableData[3].thursday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].thursday? this.getNameSubject(this.timetableData[4].thursday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[4].thursday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].thursday? this.timetableData[4].thursday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].thursday? this.getNameSubject(this.timetableData[5].thursday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[5].thursday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].thursday? this.timetableData[5].thursday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p>Thứ S&aacute;u</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].friday? this.getNameSubject(this.timetableData[0].friday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;"></td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].friday? this.timetableData[0].friday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].friday? this.getNameSubject(this.timetableData[1].friday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;"></td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].friday? this.timetableData[1].friday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].friday? this.getNameSubject(this.timetableData[2].friday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;"></td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].friday? this.timetableData[2].friday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[3].friday? this.getNameSubject(this.timetableData[3].friday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[3].friday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[3].friday? this.timetableData[3].friday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[4].friday? this.getNameSubject(this.timetableData[4].friday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[4].friday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[4].friday? this.timetableData[4].friday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[5].friday? this.getNameSubject(this.timetableData[5].friday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[5].friday)" class="absence-cell">
                                        <div v-if="this.timetableData[5].friday && this.absentListMap[this.timetableData[5].friday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[5].friday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[5].friday && this.timetableData[5].friday.absences > 0" class="text-danger">
                                            {{this.timetableData[5].friday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[5].friday? this.timetableData[5].friday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[5].friday? this.timetableData[5].friday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p>Thứ Bảy</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[0].saturday? this.getNameSubject(this.timetableData[0].saturday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[0].saturday)" class="absence-cell">
                                        <div v-if="this.timetableData[0].saturday && this.absentListMap[this.timetableData[0].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[0].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[0].saturday && this.timetableData[0].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[0].saturday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[0].saturday? this.timetableData[0].saturday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[0].saturday? this.timetableData[0].saturday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[1].saturday? this.getNameSubject(this.timetableData[1].saturday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[1].saturday)" class="absence-cell">
                                        <div v-if="this.timetableData[1].saturday && this.absentListMap[this.timetableData[1].saturday.id]">
                                            <div v-for="(student, index) in absentListMap[this.timetableData[1].saturday.id]" :key="index" class="absent-student-name">
                                                {{student.student.full_name}}
                                            </div>
                                        </div>
                                        <div v-else-if="this.timetableData[1].saturday && this.timetableData[1].saturday.absences > 0" class="text-danger">
                                            {{this.timetableData[1].saturday.absences}} học sinh vắng
                                        </div>
                                        <div v-else>
                                            {{this.timetableData[1].saturday? this.timetableData[1].saturday.absences : ""}}
                                        </div>
                                    </td>
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[1].saturday? this.timetableData[1].saturday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62.3333px;">{{this.timetableData[2].saturday? this.getNameSubject(this.timetableData[2].saturday.subject) : ""}}</td>
                                    <td style="width: 10px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.lesson_number : ""}}</td>
                                    <td style="width: 125px; height: 62.3333px;" @click="() => toggleAbsenseDetail(this.timetableData[2].saturday)" class="absence-cell">
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
                                    <td style="width: 173px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.name_lesson : ""}}</td>
                                    <td style="width: 226px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.comment : ""}}</td>
                                    <td style="width: 53px; height: 62.3333px;">{{this.timetableData[2].saturday? this.timetableData[2].saturday.evaluate : ""}}</td>
                                    <td style="width: 58px; height: 62.3333px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 82px; height: 62px;" rowspan="6">
                                        <p>Chủ Nhật</p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </td>
                                    <td style="width: 29px; height: 62px;">1</td>
                                    <td style="width: 81px; height: 62px;"></td>
                                    <td style="width: 10px; height: 62px;"></td>
                                    <td style="width: 125px; height: 62px;"></td>
                                    <td style="width: 173px; height: 62px;"></td>
                                    <td style="width: 226px; height: 62px;"></td>
                                    <td style="width: 53px; height: 62px;"></td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">2</td>
                                    <td style="width: 81px; height: 62px;"></td>
                                    <td style="width: 10px; height: 62px;"></td>
                                    <td style="width: 125px; height: 62px;"></td>
                                    <td style="width: 173px; height: 62px;"></td>
                                    <td style="width: 226px; height: 62px;"></td>
                                    <td style="width: 53px; height: 62px;"></td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">3</td>
                                    <td style="width: 81px; height: 62px;"></td>
                                    <td style="width: 10px; height: 62px;"></td>
                                    <td style="width: 125px; height: 62px;"></td>
                                    <td style="width: 173px; height: 62px;"></td>
                                    <td style="width: 226px; height: 62px;"></td>
                                    <td style="width: 53px; height: 62px;"></td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">4</td>
                                    <td style="width: 81px; height: 62px;"></td>
                                    <td style="width: 10px; height: 62px;"></td>
                                    <td style="width: 125px; height: 62px;"></td>
                                    <td style="width: 173px; height: 62px;"></td>
                                    <td style="width: 226px; height: 62px;"></td>
                                    <td style="width: 53px; height: 62px;"></td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">5</td>
                                    <td style="width: 81px; height: 62px;"></td>
                                    <td style="width: 10px; height: 62px;"></td>
                                    <td style="width: 125px; height: 62px;"></td>
                                    <td style="width: 173px; height: 62px;"></td>
                                    <td style="width: 226px; height: 62px;"></td>
                                    <td style="width: 53px; height: 62px;"></td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                                <tr style="height: 62px;">
                                    <td style="width: 29px; height: 62px;">6</td>
                                    <td style="width: 81px; height: 62px;"></td>
                                    <td style="width: 10px; height: 62px;"></td>
                                    <td style="width: 125px; height: 62px;"></td>
                                    <td style="width: 173px; height: 62px;"></td>
                                    <td style="width: 226px; height: 62px;"></td>
                                    <td style="width: 53px; height: 62px;"></td>
                                    <td style="width: 58px; height: 62px;"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-5 mb-5">

                        <input type="text" class="form-control" id="fileNameInput" placeholder="Nhập tên file" style="width: 300px; border-radius: 5px; border-color: aqua;">
                        <small slot="helperText" id="emailHelp" class="form-text text-muted">Nhập theo mẫu: Tuan6_12A1</small>

                        <base-button class="btn-success" @click="ExportToExcel">Xuất ra file xlsx</base-button>
                    </div>
                </div>
                
            </div>

        </card>

        <modal :show.sync="absencesDetailModal"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">

            <card type="secondary"
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0" >
                <template>
                    <div class="text-muted text-center mb-3" v-if="this.lessonDetail">
                        <h4 class="text-dark">Danh sách học sinh nghỉ tiết {{this.lessonDetail.time_slot.code}} ngày {{this.lessonDetail.day}} ({{this.getDayNameVN(this.getDayOfWeek(this.lessonDetail.day))}})</h4>
                    </div>
                </template>
                <template>
                    <base-table :data="absenceStudentList" :columns="student_columns">
                    <template slot="columns">
                        
                      <th>ID</th>
                      <th>Họ và tên</th>
                      <th class="text-right">Actions</th>
                    </template>
                    <template slot-scope="{ row }">
                      <td>{{ row.student.account }}</td>
                      <td>{{ row.student.full_name }}</td>
                      <td class="td-actions text-right">
                        <base-button type="info" size="sm" icon @click="toggleDetail(row.account)">
                          <i class="tim-icons icon-single-02"></i>
                        </base-button>
                      </td>
                    </template>
                  </base-table>
                </template>
                
            </card>
        </modal> 
        
      </div>
    </div>
    
</template>

<script>
import Card from "../../components/Cards/Card.vue";
import axios from "../../services/axios";
import Modal from '../../components/Modal.vue';
import * as XLSX from 'xlsx';
import BaseButton from '../../components/BaseButton.vue';
import BaseTable from '../../components/BaseTable.vue';

let API_URL = ""

        
  export default {
    components: { BaseButton, Modal, Card, BaseTable },
    props: {
        room: {
        type: Object, 
        required: true,
        default: "room",
        }
    },
    data(){
        return {
            absencesDetailModal: false,
            absenceStudentList: null,
            absentListMap: {}, // Lưu danh sách học sinh vắng cho mỗi tiết
            lessonDetail: null,
            student_columns: ["attendance_time", "id", "session" , "status" , "student"],
            semesters: null,
            weeks: [],
            semesterSelected: null,
            weekSelected: null,
            currentWeek: null,
            weekData: null,
            checkTimeTable: false,

            timetableData: null,
            dynamicData: [ { name: 'John Doe', age: 30 },
            { name: 'Jane Smith', age: 25 },],
        }
    },
    mounted() {
      this.initializeData();
      this.getCurrentSemester();
    },
    methods: {
        getCurrentSemester(){

            const token = localStorage.getItem('access_token');
            let apiURL = "";
                apiURL = API_URL+`/managements/check-semester/`
            
            axios.get(apiURL, {
                headers: {
                'Authorization': `Bearer ${token}`  // Đính kèm token vào headers
                }
            })
            .then((response) => {
                this.semesterSelected = response.data
                this.weekSelected = "hiện tại"
                this.weekData = this.semesterSelected.current_week
                this.getWeekData();
                this.getTimeTable();
            })
            .catch(error => {
                console.error("Error", error);
                this.$notify({
                type: 'danger',
                icon: 'tim-icons icon-alert-circle-exc',
                message: "Lấy thông tin hoc ky hien tai that bai",
                timeout: 3000,
                verticalAlign: 'top',
                horizontalAlign: 'center',
                });
            });
        },
        toggleAbsenseDetail(lesson){
            this.absencesDetailModal = true;
            this.lessonDetail = lesson
            this.getAbsenceStudentList(lesson);
        },
        getAbsenceStudentList(lesson){
            const token = localStorage.getItem("access_token");
            axios
            .get(API_URL+`/rooms_managements/attendances/?status=false&session=${lesson.id}&q={student{account,full_name}}`,  {
            headers: {
                Authorization: `Bearer ${token}`, // Đính kèm token vào headers
                "Content-Type": "application/json",
            },
            })
            .then((response) => {
            this.absenceStudentList = response.data 
            console.log(this.absenceStudentList)
            })
            .catch((error) => {
            console.error("Error ", error);
            this.$notify({
                    type: "warning",
                    icon: 'tim-icons icon-bell-55',
                    message: "Lấy danh sách học sinh nghỉ học thất bại",
                    timeout: 3000,
                    verticalAlign: "top",
                    horizontalAlign: "right",
                });
            });       
        },
        getNameSubject(name){
            switch(name){
                case "TOAN" : return "Toán"
                case "VAN" : return "Ngữ Văn"
                case "ANH" : return "Tiếng Anh"
                case "KHTN_HOA" : return "KHTN Hoá"
                case "KHTN_LY" : return "KHTN Vật Lý"
                case "KHTN_SINH" : return "KHTN Sinh học"
                case "KHXH_DIA" : return "KHXH Địa lý"
                case "KHXH_SU" : return "KHXH Lịch sử"
                case "KHXH_GDCD" : return "KHXH GDCD"
                case "TD" : return "Thể dục"
                case "MT" : return "Mỹ thuật"
                case "AN" : return "Âm nhạc"
                case "TH" : return "Tin học"
                case "CN" : return "Công nghệ"
                case "HDTN-HN" : return "HĐTN, HN"
            }
        },
        shortenName(fullName) {
            const nameParts = fullName.trim().split(' '); // Tách tên thành các phần
            if (nameParts.length == 3) return nameParts.slice(1).join(' '); // Nếu chỉ có một phần, trả về tên gốc
            if (nameParts.length == 4) return nameParts.slice(2).join(' '); // Lấy các phần sau họ và ghép lại
            return fullName
        },
        getTimeTable() {
            console.log("test")
            console.log(this.weekSelected)
            console.log(this.semesterSelected)
            if(!this.weekSelected || !this.semesterSelected){
            this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Vui lòng chọn đầy đủ lựa chọn học kỳ, tuần.",
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
            });
            return
            }
            this.checkTimeTable =false;

            this.timetableData = this.initializeTimetableData()

            let date = null
            if(this.weekSelected === "hiện tại") {
            date = new Date();
            }
            else {
            // Chuyển đổi weekSelected thành số nguyên
            const week_number = parseInt(this.weekSelected, 10);
            
            const semesterStartDate = new Date(this.semesterSelected.start_date); // Ngày bắt đầu của học kỳ
            // Tính toán ngày bằng cách cộng thêm số tuần đã chọn
            date = new Date(semesterStartDate);
            date.setDate(semesterStartDate.getDate() + (week_number - 1) * 7);
            }
            const startOfWeek = this.getStartOfWeek(date);
            const endOfWeek = this.getEndOfWeek(date);
            const startDate = this.formatDate(startOfWeek);
            const endDate = this.formatDate(endOfWeek);
            const token = localStorage.getItem("access_token");

            const api = API_URL + `/managements/sessions?semester_code__code=${this.semesterSelected.semester}&room_id=${this.room.id}&start_date=${startDate}&end_date=${endDate}`;
            axios
            .get(api, {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            })
            .then((response) => {
                this.lessons = response.data;
                console.log(this.lessons)
                if(response.data.length === 0) {
                this.$notify({
                type: "warning",
                icon: 'tim-icons icon-bell-55',
                message: "Không tồn tại kết quả tiết học của lớp " +this.room.name + " trong tuần " + this.weekData,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
                });
                }
                else {
                this.timetableData = this.formatTimetableData(this.lessons);

                this.$notify({
                type: "success",
                icon: 'tim-icons icon-bell-55',
                message: "Lọc thành công sổ đầu bài lớp " +this.room.name + " tuần " + this.weekData,
                timeout: 3000,
                verticalAlign: "top",
                horizontalAlign: "right",
                });
                }
            })
            .catch((error) => {
                console.error("Error getting timetable:", error);
            });
        },
        getStartOfWeek(date) {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(date.setDate(diff));
        },
        getEndOfWeek(date) {
            const startOfWeek = this.getStartOfWeek(date);
            return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        getDayOfWeek(dateString) {
            const date = new Date(dateString);
            const day = date.getDay();
            return (day === 0) ? 6 : day - 1; // Chủ nhật là 6
        },
        initializeTimetableData() {
            // Tạo một mảng với các tiết từ 1 đến 5
            return Array.from({ length: 6 }, (_, index) => ({
            period: index + 1,
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            }));
        },
        formatTimetableData(lessons) {
            // Cập nhật bảng thời khóa biểu với các tiết học
            lessons.forEach(lesson => {
            const periodIndex = lesson.time_slot.code - 1;
            console.log(periodIndex)
            const dayOfWeek = this.getDayOfWeek(lesson.day);
            if (this.timetableData[periodIndex]) {
                this.timetableData[periodIndex][this.getDayName(dayOfWeek)] = lesson; // Thêm lesson vào đúng ngày
                
                // Nếu có học sinh vắng, lấy danh sách
                if (lesson.absences > 0) {
                    this.fetchAbsentStudents(lesson);
                }
            }
            });
            console.log(this.timetableData)
            return this.timetableData;
        },
        getDayName(day) {
            switch (day) {
            case 0: return 'monday';
            case 1: return 'tuesday';
            case 2: return 'wednesday';
            case 3: return 'thursday';
            case 4: return 'friday';
            case 5: return 'saturday';
            default: return '';
            }
        },
        getDayNameVN(day) {
            switch (day) {
            case 0: return 'Thứ Hai';
            case 1: return 'Thứ Ba';
            case 2: return 'Thứ Tư';
            case 3: return 'Thứ Năm';
            case 4: return 'Thứ Sáu';
            case 5: return 'Thứ Bảy';
            default: return 'CN';
            }
        },
        takeWeekData(){
            if(this.weekSelected === "hiện tại") {
            this.weekData = this.currentWeek
            }
            else this.weekData = this.weekSelected
        },
        getWeekData(){
            console.log("test")
            console.log(this.semesterSelected)
            if(!this.semesterSelected) return;

            else {
            const arr = ["hiện tại"];
            // let number_of_week = this.semesterSelected.weeks_count
            let number_of_week = 15

            const semesterStartDate = new Date(this.semesterSelected.start_date); // Ngày bắt đầu của học kỳ
            const currentDate = new Date();

            // Tính toán tuần hiện tại
            const diffTime = currentDate - semesterStartDate; // Chênh lệch thời gian
            this.currentWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1; // Tính số tuần

            for (let i = 1; i <= number_of_week; i++) {
                arr.push(i);
            }
            this.weeks = arr
            } 
        },
        async initializeData() {
        try {
          await this.getApiUrl();
          await this.getSemesterData();
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


    ExportToExcel() {
      const fileName = document.getElementById('fileNameInput').value || 'DynamicData';
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.table_to_sheet(document.getElementById('tableDiv').querySelector('table'));
      XLSX.utils.book_append_sheet(wb, ws, 'Dynamic Data');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    },

    fetchAbsentStudents(lesson) {
        if (!lesson || lesson.absences <= 0) return;
        
        const token = localStorage.getItem("access_token");
        axios
        .get(API_URL+`/rooms_managements/attendances/?status=false&session=${lesson.id}&q={student{account,full_name}}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            // Sử dụng $set để đảm bảo Vue cập nhật UI khi thay đổi giá trị của đối tượng
            this.$set(this.absentListMap, lesson.id, response.data);
        })
        .catch((error) => {
            console.error("Error fetching absent student list:", error);
        });
    },

    }
  };

</script>
<style scoped>
td {
    color: black;
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
    margin-bottom: 2px;
    font-size: 12px;
    line-height: 1.2;
}

.text-danger {
    color: #dc3545;
}
</style>
