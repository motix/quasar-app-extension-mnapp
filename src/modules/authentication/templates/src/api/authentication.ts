import { axios } from 'boot/axios'

export default {
  isAuthenticated () {
    const API_URL = '<%= prompts.isAuthenticatedUrl %>'
    return axios.get(API_URL)
  },

  currentUser () {
    const API_URL = '<%= prompts.currentUserUrl %>'
    return axios.get(API_URL)
  }
}
