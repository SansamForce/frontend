<script setup>
const props = defineProps({
  teamMemberScheduleList: {
    type: Array,
    required: true
  },
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

<router-link to="/team/:id/memberSchedule"></router-link>

<template>
  <br/><br/>
  <h5 class="team-schedule-text">팀원 일정 조회</h5>

  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>

  <!-- 모달 창 -->
  <Modal v-if="showModal" :show-modal="showModal" :event-data="selectedDateInfo" :isEditMode="isEditMode" @confirm="handleModalConfirm" @cancel="handleModalCancel"  @delete="handleModalDelete" />
</template>

<script>
import axios from "axios";
import Modal from "@/components/team/TeamMemberScheduleModal.vue";
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
        events: [],
      },
      showModal: false, // 모달 상태 관리
      selectedDateInfo: null, // 선택한 날짜 정보 저장
      isEditMode: false,
    };
  },
  props: {
    teamScheduleList: {
      type: Array,
      required: true
    },
    teamMemberScheduleList: {
      type: Array,
      required: true
    },
    teamSeq: {
      type: BigInt,
      required: true
    }
  },
  mounted() {
    if (this.teamMemberScheduleList.length > 0) {
      this.calendarOptions.events = this.convertScheduleListToEvents(this.teamMemberScheduleList);
    }
  },
  methods: {
    convertScheduleListToEvents(scheduleList) {
      return scheduleList.map(schedule => ({
        id: schedule.teamMemberScheduleSeq, // 각 이벤트에 고유한 ID가 있어야 합니다
        title: schedule.teamScheduleProgressContent || 'Untitled Event', // 이벤트의 제목
        start: schedule.startDate, // 시작 날짜 (YYYY-MM-DD 형식)
        end: schedule.endDate, // 종료 날짜 (YYYY-MM-DD 형식)
        extendedProps: { // 추가 속성
          percent: schedule.teamScheduleProgressPercent,
          feedback: schedule.teamScheduleProgressFeedback
        }
      }));
    },
    handleDateSelect(info) {
      this.selectedDateInfo = info; // 선택한 날짜 정보 저장
      this.showModal = true; // 모달 창 열기
      this.isEditMode = false;
    },
    async handleModalConfirm(type) {
      if(type.type == 'CREATE') {
        if (type.eventDetails && this.selectedDateInfo) {
          const newEvent = {
            teamScheduleSeq: 1,
            teamMemberSeq:1,
            memberScheduleContent: type.eventDetails.title,
            memberSchedulePercent: type.eventDetails.percent,
            startDate: type.eventDetails.start,
            endDate: type.eventDetails.end,
          };

          const response = await axios.post(`http://localhost:8086/api/v1/team/${this.teamSeq}/memberSchedule`, newEvent, {
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

      } if(type.type == 'UPDATE') {
        const updatedEventData = {
          teamScheduleSeq: 1,
          teamMemberSeq:1,
          memberScheduleContent: type.eventDetails.title,
          memberSchedulePercent: type.eventDetails.percent,
          startDate: type.eventDetails.start,
          endDate: type.eventDetails.end,
        };

        try {
          await axios.put(`http://localhost:8086/api/v1/team/${this.teamSeq}/memberSchedule/${this.selectedDateInfo.id}`, updatedEventData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          alert('이벤트가 성공적으로 수정되었습니다.');

          // FullCalendar의 이벤트 리스트에서도 수정
          const event = this.calendarOptions.events.find(e => e.id === this.selectedDateInfo.id);
          if (event) {
            event.title = type.eventDetails.title;
            event.start = type.eventDetails.start;
            event.end = type.eventDetails.end;
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
      console.log(info.event);
      this.selectedDateInfo = { // 선택한 이벤트 데이터를 저장
        id: info.event.id, // 각 이벤트에 고유한 ID가 있어야 합니다
        title: info.event.title || 'Untitled Event', // 이벤트의 제목
        percent: info.event.extendedProps.percent,
        feedback: info.event.extendedProps.feedback,
        start: info.event.start.toLocaleDateString('en-CA'), // "YYYY-MM-DD" 형식으로 변환
        end: info.event.end ? info.event.end.toLocaleDateString('en-CA') : null
      };
      console.log(this.selectedDateInfo);
      this.showModal = true; // 모달 창 열기
      this.isEditMode = true;
    },
    async handleModalDelete() {
      try {
        await axios.delete(`http://localhost:8086/api/v1/team/${this.teamSeq}/memberSchedule/${this.selectedDateInfo.id}`, {
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
        scheduleStartDate: info.event.start.toLocaleDateString('en-CA'),
        scheduleEndDate: info.event.end ? info.event.end.toLocaleDateString('en-CA') : null,
      };
      axios.put(`http://localhost:8086/api/v1/team/${this.teamSeq}/memberSchedule/${info.event.id}`, updatedEvent, {
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
        teamScheduleProgressContent: info.event.title,
        teamScheduleProgressPercent: info.event.percent,
        startDate: info.event.start.toLocaleDateString('en-CA'),
        endDate: info.event.end ? info.event.end.toLocaleDateString('en-CA') : null,
      };
      axios.put(`http://localhost:8086/api/v1/team/${this.teamSeq}/memberSchedule/${info.event.id}`, updatedEvent, {
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

</style>
