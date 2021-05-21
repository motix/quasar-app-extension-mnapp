import axios from 'axios'
import { User } from 'models/authentication'

export default {
  isAuthenticated () {
    const API_URL = '<%= prompts.isAuthenticatedUrl %>'
    return axios.get<boolean>(API_URL)
  },

  currentUser () {
    const API_URL = '<%= prompts.currentUserUrl %>'
    return axios.get<{ status: string; currentUser: User }>(API_URL)
  }
}
