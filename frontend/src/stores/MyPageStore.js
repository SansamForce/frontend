// stores/MyPageStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useMyPageStore = defineStore('myPage', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  actions: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:8086/api/v1/user/${this.user.id}/info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.user = response.data.data;

        // 성별 및 생년월일 데이터 포맷
        this.user.userGender = this.user.userGender === 'MALE' ? 'male' : 'female';
        if (this.user.userBirthDate) {
          this.user.userBirthDate = this.user.userBirthDate.split('T')[0];
        }
        
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async saveUserData() {
      try {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(this.user)], { type: 'application/json' }));
        if (this.user.profileImg instanceof File) {
          formData.append('userProfileImg', this.user.profileImg);
        }

        const token = localStorage.getItem('authToken');
        await axios.put(`http://localhost:8086/api/v1/user/${this.user.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });

        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
      }
    },
    setProfileImage(file) {
      this.user.profileImg = file;
    },
  },
});
