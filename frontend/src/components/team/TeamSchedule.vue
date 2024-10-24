<script setup>
const props = defineProps({
  teamScheduleList: {
    type: Array,
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
  <Modal v-if="showModal" :show-modal="showModal" @confirm="handleModalConfirm" @cancel="handleModalCancel" />
</template>

<script>
import axios from "axios";
import Modal from "@/components/team/teamScheduleModal.vue";
import FullCalendar from '@fullcalendar/vue3'; // FullCalendar Vue3 컴포넌트
import dayGridPlugin from '@fullcalendar/daygrid'; // 기본적인 그리드 형식의 달력 플러그인
import timeGridPlugin from '@fullcalendar/timegrid'; // 시간 단위 그리드 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 사용자 상호작용 (날짜 클릭 등) 플러그인

// 인증 토큰 가져오기
const getToken = () => localStorage.getItem('authToken');

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
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // 사용 플러그인 설정
        initialView: 'dayGridMonth', // 첫 화면에 월간 그리드 보여주기
        editable: true, // 드래그 앤 드롭으로 이벤트 편집 가능
        selectable: true, // 날짜 선택 가능
        selectMirror: true,
        dayMaxEvents: true, // 하루에 여러 이벤트 있을 때 축약하여 보여줌
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'today',
        },
        events: [
          {
            title: '회의',
            start: new Date().toISOString().slice(0, 10), // 오늘 날짜
          },
          {
            title: '프로젝트 마감일',
            start: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 10),
          },
        ],
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize,
      },
      showModal: false, // 모달 상태 관리
      selectedDateInfo: null, // 선택한 날짜 정보 저장
    };
  },
  methods: {
    handleDateSelect(info) {
      this.selectedDateInfo = info; // 선택한 날짜 정보 저장
      this.showModal = true; // 모달 창 열기
      console.log(this.showModal);
    },
    async handleModalConfirm(eventTitle) {
      if (eventTitle && this.selectedDateInfo) {
        const newEvent = {
          scheduleContent: eventTitle,
          scheduleStartDate: this.selectedDateInfo.startStr,
          scheduleEndDate: this.selectedDateInfo.endStr,
        };
        const token = getToken();
        const response = await axios.post('http://localhost:8086/api/v1/team/1/schedule', newEvent, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },)
            .then(() => {
              alert('새 이벤트가 저장되었습니다.');
              this.calendarOptions.events.push(newEvent); // 로컬에서도 이벤트 추가
            })
            .catch((error) => {
              console.error('이벤트 추가 중 오류 발생:', error);
              alert('이벤트 저장 중 오류가 발생했습니다.');
            });
      }
      this.showModal = false; // 모달 창 닫기
    },
    handleModalCancel() {
      this.showModal = false; // 모달 창 닫기
    },
    handleEventClick(info) {
      alert(`이벤트: ${info.event.title}`);
    },
    handleEventDrop(info) {
      const updatedEvent = {
        scheduleContent: info.event.title,
        scheduleStartDate: info.event.start.toISOString().slice(0, 10),
        scheduleEndDate: info.event.end ? info.event.end.toISOString().slice(0, 10) : null,
      };
      axios.put(`http://localhost:8086/api/v1/team/{teamSeq}/schedule/${info.event.id}`, updatedEvent)
          .then(() => {
            alert('이벤트 날짜가 변경되었습니다.');
          })
          .catch((error) => {
            console.error('이벤트 업데이트 중 오류 발생:', error);
            alert('이벤트 업데이트 중 오류가 발생했습니다.');
            info.revert();
          });
    },
    handleEventResize(info) {
      const updatedEvent = {
        scheduleContent: info.event.title,
        scheduleStartDate: info.event.start.toISOString().slice(0, 10),
        scheduleEndDate: info.event.end ? info.event.end.toISOString().slice(0, 10) : null,
      };
      axios.put(`http://localhost:8086/api/v1/team/{teamSeq}/schedule/${info.event.id}`, updatedEvent)
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

/* 특정 요일 스타일 변경 (예: 토요일, 일요일) */
.fc-day-sat, .fc-day-sun {
  background-color: #777777; /* 주말 배경색 */
}

/* 이벤트 텍스트 색상 */
.fc-event-title {
  color: #49454F; /* 이벤트 제목 텍스트 색상 */
}
</style>
