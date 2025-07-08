// config.js



// Notification Messages
export const API_NOTIFICATION_MESSAGES = {
  loading: {
    title: 'Loading...',
    message: 'Data is being loaded, please wait...',
  },
  success: {
    title: 'Success',
    message: 'Data successfully loaded.',
  },
  responseFailure: {
    title: 'Error',
    message: 'An error occurred while fetching response from the server. Please try again.',
  },
  requestFailure: {
    title: 'Error',
    message: 'An error occurred while parsing request data.',
  },
  networkError: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check internet connectivity.',
  },
};

// API endpoint services
export const SERVICE_URLS = {
 
  contactUs: { url: '/contactUs', method: 'POST' },
  googleauth: { url: '/google-auth', method: 'POST' },
  updateProfile : {url : '/updateProfile' , method : 'PUT'},
  checkAuth: {url : '/check' , method : 'GET'},
  logout: {url : '/logout' , method : 'POST'} ,
  getUsersForSidebar : {url : '/chatlist' , method : 'GET'},
  
 sendMessage: ({ id, text , image }) => ({
  url: `/send/${id}`,
  method: "POST",
  data: { text , image},
}),
  getMessages : (id) => ({ url : `/create/${id}` , method : 'GET'}),

  // newChat: { url: '/newChat', method: 'POST' },
  // getAllChat: { url: '/chats', method: 'GET', query: true },

  // newRatings: { url: '/rating', method: 'POST' },
  // getRatings: (username) => ({
  //   url: `/ratings/${username}`,
  //   method: 'GET',
  //   query: true,
  // }),
};
