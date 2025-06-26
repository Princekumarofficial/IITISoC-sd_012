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
  // userSignup: { url: '/signup', method: 'POST' },
  // userLogin: { url: '/login', method: 'POST' },

  // createRide: { url: '/create', method: 'POST' },
  // getAllRide: { url: '/rides', method: 'GET', params: true },
  // getRideById: (id) => ({ url: `/rideDetail/${id}`, method: 'GET' }),
  // deleteRide: (id) => ({ url: `/delete/${id}`, method: 'DELETE' }),
  // updateRide: { url: '/update', method: 'PUT', query: true },

  // newReply: { url: '/newReply', method: 'POST' },
  // getAllReplies: { url: '/replies', method: 'GET', query: true },
  // deleteReply: { url: '/reply/delete', method: 'DELETE', query: true },
  // updateReply: { url: '/reply/update', method: 'PUT' },
  // getReplies: { url: '/allreplies', method: 'GET', params: true },

  contactUs: { url: '/contactUs', method: 'POST' },
  googleauth: { url: '/google-auth', method: 'POST' },

  // newChat: { url: '/newChat', method: 'POST' },
  // getAllChat: { url: '/chats', method: 'GET', query: true },

  // newRatings: { url: '/rating', method: 'POST' },
  // getRatings: (username) => ({
  //   url: `/ratings/${username}`,
  //   method: 'GET',
  //   query: true,
  // }),
};
