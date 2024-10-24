<template>
  <div>
    <div class="main-container">
      <div class="content">
        <h1 class="title">T-BUILDING</h1>
        <p class="description">
          개발자 팀 프로젝트의 <br /> 모든 여정을 <br />
          T-BUILDING에서 함께.
        </p>
        <router-link to="/projectBoards" class="explore-button">
          프로젝트 둘러보기 ->
        </router-link>
      </div>
      <div class="image-container">
        <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729732473446_%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%AF%B8%EC%A7%801.png" alt="Project overview image" />
      </div>
    </div>

    <!-- 첫 번째 섹션: 왼쪽 이미지, 오른쪽 텍스트 -->
    <div class="bottom-section">
      <div class="left-image">
        <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729733004757_%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%AF%B8%EC%A7%802.png" alt="Left side image" />
      </div>
      <div class="right-text">
        <div class="icon-text right-align">
          <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729732433329_%EC%95%84%EC%9D%B4%EC%BD%981.png" alt="Icon" class="icon" />
          <h2>프로젝트 목록 조회 및 신청</h2>
        </div>
        <p>나에게 맞는 개발 프로젝트를 <br /> 찾아 신청해보세요</p>
      </div>
    </div>

    <!-- 두 번째 섹션: 오른쪽 이미지, 왼쪽 텍스트 -->
    <div class="bottom-section reverse-layout">
      <div class="right-image">
        <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729733161127_%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%AF%B8%EC%A7%803.png" alt="right side image" />
      </div>
      <div class="left-text">
        <div class="icon-text">
          <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729733046159_%EC%95%84%EC%9D%B4%EC%BD%982.png" alt="Icon" class="icon" />
          <h2>팀 일정 관리 & 팀 채팅</h2>
        </div>
        <p>팀원들과 개발 계획을 공유하고 <br /> 소통할 수 있어요</p>
      </div>
    </div>

    <!-- 세 번째 섹션: 왼쪽 이미지, 오른쪽 텍스트 -->
    <div class="bottom-section">
      <div class="left-image">
        <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729735534929_%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%AF%B8%EC%A7%804.png" alt="Left side image" />
      </div>
      <div class="right-text">
        <div class="icon-text right-align">
          <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729735656522_%EC%95%84%EC%9D%B4%EC%BD%983.png" alt="Icon" class="icon" />
          <h2>진행상황 피드백</h2>
        </div>
        <p>진행 상황과 관련해 <br /> 멘토에게 피드백을 받아보세요</p>
      </div>
    </div>

    <!-- 네 번째 섹션: 오른쪽 이미지, 왼쪽 텍스트 -->
    <div class="bottom-section reverse-layout">
      <div class="right-image">
        <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729735730918_%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%AF%B8%EC%A7%805.png" alt="right side image" />
      </div>
      <div class="left-text">
        <div class="icon-text">
          <img src="https://sansamforce.s3.ap-northeast-2.amazonaws.com/1729735634118_%EC%95%84%EC%9D%B4%EC%BD%984.png" alt="Icon" class="icon" />
          <h2>팀원 리뷰</h2>
        </div>
        <p>프로젝트를 함께한 팀원에 대해 <br /> 후기를 남길 수 있어요</p>
      </div>
    </div>

    <div class="final-button-container">
      <router-link to="/login" class="final-button">
        T-BUILDING 시작하기 <span class="arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 필요한 로직이 있으면 여기에 추가
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10vw 10vw;
  background-color: #222;
  color: #fff;
  height: 100vh;
  box-sizing: border-box;
  user-select: none;
}

.content {
  max-width: 45%;
}

.title {
  font-size: 5vw;
  font-weight: bold;
  color: #3ff3ff;
  margin-bottom: 7vh;
}

.description {
  font-size: 2.5vw;
  font-weight: bold;
  margin-bottom: 6vh;
  line-height: 1.5;
}

.explore-button {
  display: inline-block;
  padding: 2vh 3vw;
  background-color: #3ff3ff;
  color: #222;
  font-size: 2vw;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.explore-button:hover {
  background-color: #00b3b3;
}

.image-container {
  padding-top: 20vh;
  max-width: 35%;
}

.image-container img {
  width: 100%;
  height: auto;
}

/* 추가된 섹션: 왼쪽 이미지와 오른쪽 텍스트 */
.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5vh 10vw;
  background-color: #222;
  color: #fff;
}

.left-image {
  max-width: 35%;
}

.right-image {
  max-width: 35%;
}

.left-image img, .right-image img {
  width: 100%;
  height: auto;
}

.right-text {
  max-width: 55%;
  font-weight: bold;
  text-align: right;
}

.left-text {
  max-width: 55%;
  font-weight: bold;
  text-align: left; /* 텍스트 왼쪽 정렬 */
}

.icon-text {
  display: flex;
  align-items: center;
}

.right-align {
  justify-content: flex-end;
}

.icon {
  margin-right: 10px;
  width: 1.2vw;
  height: 1.2vhpx;
}

.right-text h2, .left-text h2 {
  font-size: 1vw;
  color: white;
  margin-bottom: 0%;
  user-select: none; /* 텍스트 드래그 방지 */
}

.right-text p, .left-text p {
  font-size: 2.5vw;
  color: #3ff3ff;
  margin-top: 1vh;
  user-select: none; /* 텍스트 드래그 방지 */
}

/* 두 번째 섹션: 오른쪽 이미지와 왼쪽 텍스트 */
.reverse-layout {
  flex-direction: row-reverse; /* 반대 방향으로 설정 */
}

/* 버튼 스타일링 */
.final-button-container {
  display: flex;
  justify-content: center;
  padding: 5vh 0; /* 위 아래 패딩 */
  background-color: #222;
  font-weight: bold;
}

.final-button {
  padding: 15px 30px; /* 버튼 내부 패딩 */
  background-color: #3ff3ff;
  color: #222;
  font-size: 24px; /* 버튼 폰트 크기 */
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.final-button:hover {
  background-color: #00b3b3;
}

.arrow {
  margin-left: 8px; /* 화살표와 텍스트 간격 */
}

.title, .description, .explore-button {
  user-select: none; /* 텍스트 드래그 방지 */
}

/* 작은 화면에 맞게 조정하는 미디어 쿼리 */
@media (max-width: 768px) {
  .bottom-section {
    flex-direction: column;
    text-align: center;
  }

  .left-image {
    max-width: 80%;
    margin-bottom: 3vh;
  }

  .right-text, .left-text {
    text-align: center;
    max-width: 100%;
  }

  .icon-text {
    justify-content: center;
  }

  .icon {
    width: 32px;
    height: 32px;
  }

  .right-text h2, .left-text h2 {
    font-size: 5vw;
  }

  .right-text p, .left-text p {
    font-size: 4vw;
  }
}
</style>
