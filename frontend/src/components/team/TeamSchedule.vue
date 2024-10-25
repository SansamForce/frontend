<script setup>
const props = defineProps({
  teamScheduleList: {
    type: Array,
    required: true
  },
  teamSeq: {
    type: BigInt,
    required: true
  }
})
</script>

<router-link to="/projects/:id/team/:id/schedule"></router-link>

<template>
  <br />
  <h5 class="team-schedule-text">팀 일정 조회</h5>

  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>

  <!-- 모달 창 -->
  <Modal v-if="showModal" :show-modal="showModal" :team-schedule-content="teamScheduleContent" :isEditMode="isEditMode" @confirm="handleModalConfirm" @cancel="handleModalCancel"  @delete="handleModalDelete" />
</template>

<script>
import axios from "axios";
import Modal from "@/components/team/teamScheduleModal.vue";
import FullCalendar from '@fullcalendar/vue3'; // FullCalendar Vue3 컴포넌트
import dayGridPlugin from '@fullcalendar/daygrid'; // 기본적인 그리드 형식의 달력 플러그인
import timeGridPlugin from '@fullcalendar/timegrid'; // 시간 단위 그리드 플러그인
import interactionPlugin from '@fullcalendar/interaction';

export default {
  components: {
    FullCalendar,
    Modal,
  },
  data() {
    return {
      fields: [
        { key: 'teamScheduleContent', label: '일정내용' },
        { key: 'teamScheduleEndDate', label: '마감일자' },
        { key: 'teamScheduleStartDate', label: '시작일자' },
      ],
      calendarOptions: {
        editable: true,
        eventResizableFromStart: true, // 시작 부분에서 리사이징 가능하게 설정
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // 사용 플러그인 설정
        initialView: 'dayGridMonth', // 첫 화면에 월간 그리드 보여주기
        selectable: true, // 날짜 선택 가능
        selectMirror: true,
        dayMaxEvents: true, // 하루에 여러 이벤트 있을 때 축약하여 보여줌
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'today',
        },
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize, // 리사이즈 핸들러 연결
        events: this.convertScheduleListToEvents(this.teamScheduleList),
      },
      showModal: false, // 모달 상태 관리
      selectedDateInfo: null, // 선택한 날짜 정보 저장
      isEditMode: false,
      teamScheduleContent : '',
    };
  },
  props: {
    teamScheduleList: {
      type: Array,
      required: true
    },
    teamSeq: {
      type: BigInt,
      required: true
    }
  },
  mounted() {
    if (this.teamScheduleList.length > 0) {
      this.calendarOptions.eventc = this.convertScheduleListToEvents(this.teamScheduleList);
    }
  },
  methods: {
    // teamScheduleList를 FullCalendar에서 사용할 수 있는 이벤트 형식으로 변환
    convertScheduleListToEvents(scheduleList) {
      return scheduleList.map(schedule => ({
        id: schedule.teamScheduleSeq,
        title: schedule.teamScheduleContent,
        start: schedule.teamScheduleStartDate,
        end: schedule.teamScheduleEndDate,
      }));
    },
    handleDateSelect(info) {
      this.selectedDateInfo = info; // 선택한 날짜 정보 저장
      this.showModal = true; // 모달 창 열기
      this.isEditMode = false;
    },
    async handleModalConfirm(type, eventTitle) {
      if(type == 'CREATE') {
        if (eventTitle && this.selectedDateInfo) {
          const newEvent = {
            scheduleContent: eventTitle,
            scheduleStartDate: this.selectedDateInfo.startStr,
            scheduleEndDate: new Date(new Date(this.selectedDateInfo.endStr).getTime() - 86400000).toLocaleDateString('en-CA'),
          };

          const response = await axios.post(`http://localhost:8086/api/v1/team/${this.teamSeq}/schedule`, newEvent, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          })
              .then(() => {
                alert('새 이벤트가 저장되었습니다.');
                this.calendarOptions.events.push(newEvent); // 로컬에서도 이벤트 추가
              })
              .catch((error) => {
                console.error('이벤트 추가 중 오류 발생:', error);
                alert('이벤트 저장 중 오류가 발생했습니다.');
              });
        }

      } if(type == 'UPDATE') {
        const updatedEventData = {
          scheduleContent: eventTitle,
          scheduleStartDate: this.selectedDateInfo.start,
          scheduleEndDate: this.selectedDateInfo.end,
        };

        try {
          await axios.put(`http://localhost:8086/api/v1/team/${this.teamSeq}/schedule/${this.selectedDateInfo.id}`, updatedEventData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          alert('이벤트가 성공적으로 수정되었습니다.');

          // FullCalendar의 이벤트 리스트에서도 수정
          const event = this.calendarOptions.events.find(e => e.id === this.selectedDateInfo.id);
          if (event) {
            event.title = eventTitle;
            event.start = this.selectedDateInfo.start;
            event.end = this.selectedDateInfo.end;
          }
        } catch (error) {
          console.error('이벤트 업데이트 중 오류 발생:', error);
          alert('이벤트 업데이트 중 오류가 발생했습니다.');
        }
      }
      this.showModal = false; // 모달 창 닫기
      location.reload(true);
    },
    handleModalCancel() {
      this.showModal = false; // 모달 창 닫기
    },
    handleEventClick(info) {
      this.selectedDateInfo = { // 선택한 이벤트 데이터를 저장
        id: info.event.id,
        title: info.event.title,
        start: info.event.start.toLocaleDateString('en-CA'), // "YYYY-MM-DD" 형식으로 변환
        end: info.event.end ? info.event.end.toLocaleDateString('en-CA') : null
      };
      this.teamScheduleContent = info.event.title;
      this.showModal = true; // 모달 창 열기
      this.isEditMode = true;
    },
    async handleModalDelete() {
      try {
        await axios.delete(`http://localhost:8086/api/v1/team/${this.teamSeq}/schedule/${this.selectedDateInfo.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        alert('이벤트가 성공적으로 삭제되었습니다.');

      } catch (error) {
        console.error('이벤트 삭제 중 오류 발생:', error);
        alert('이벤트 삭제 중 오류가 발생했습니다.');
      }
      this.showModal = false; // 모달 창 닫기
      this.isEditMode = false;
      location.reload(true);
    },
    handleEventDrop(info) {
      const updatedEvent = {
        scheduleContent: info.event.title,
        scheduleStartDate: info.event.start.toLocaleDateString('en-CA'),
        scheduleEndDate: info.event.end ? info.event.end.toLocaleDateString('en-CA') : null,
      };
      axios.put(`http://localhost:8086/api/v1/team/${this.teamSeq}/schedule/${info.event.id}`, updatedEvent, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
          .then(() => {
            alert('이벤트 날짜가 변경되었습니다.');
          })
          .catch((error) => {
            console.error('이벤트 업데이트 중 오류 발생:', error);
            alert('이벤트 업데이트 중 오류가 발생했습니다.');
            info.revert();
          });
      location.reload(true);
    },
    handleEventResize(info) {
      const updatedEvent = {
        scheduleContent: info.event.title,
        scheduleStartDate: info.event.start.toLocaleDateString('en-CA'),
        scheduleEndDate: info.event.end ? info.event.end.toLocaleDateString('en-CA') : null,
      };
      axios.put(`http://localhost:8086/api/v1/team/${this.teamSeq}/schedule/${info.event.id}`, updatedEvent, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
          .then(() => {
            alert('이벤트 기간이 변경되었습니다.');
          })
          .catch((error) => {
            console.error('이벤트 업데이트 중 오류 발생:', error);
            alert('이벤트 업데이트 중 오류가 발생했습니다.');
            info.revert();
          });
    },
  },
};
</script>

<style scoped>
.team-schedule-text {
  font-weight: bold;
}

.team-schedule-text:after {
  content: "";
  display: block;
  width: 16%;
  border-bottom: 2px solid #000000;
  margin: 13px 0 13px 0;
}

.calendar-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.fc-event-resizer {
  width: 10px;
  height: 10px;
  background: #000;
  cursor: ew-resize; /* 리사이즈할 때 마우스 커서 변경 */
}

.fc-event-resizer-start {
  left: -5px;
}

.fc-event-resizer-end {
  right: -5px;
}

</style>
