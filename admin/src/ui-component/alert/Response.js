import { toast } from 'react-toastify';
// import { logout } from 'session';

const handleErrorResponse = (error) => {
  if (error.response) {
    if (error.response.status === 401) {
      logout();
    } else if (error.response.status === 404) {
      console.warn(error.response.data.error);
    } else {
      toast.warn(error.response.data.error || 'An error occurred', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  }
};

const handleErrorResponseNormal = (error) => {
  if (error.response) {
    toast.warn(error.response.data.error || 'An error occurred', {
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  }
};

const handleSuccessResponse = (msg) => {
  toast.success(msg, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};

const handleSuccessResponseMessage = (response) => {
  toast.success(response.data.message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};

const handleErrorMassage = (msg) => {
  toast.warn(msg, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};

export { handleErrorResponse, handleSuccessResponse, handleSuccessResponseMessage, handleErrorMassage, handleErrorResponseNormal };
