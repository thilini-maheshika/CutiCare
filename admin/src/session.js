// sessionStorage.js
const setToken = (token) => {
  localStorage.setItem('token', token);
};

const setUserid = (userid) => {
  localStorage.setItem('userid', userid);
};

const setPermissionCodes = (permissions) => {
  // Store the permission codes array in session storage
  const permissionCodesString = JSON.stringify(permissions);
  sessionStorage.setItem('permissionCodes', permissionCodesString);
};

// Function to get user permissions from session storage
// Function to get permission codes from session storage
const getPermissionCodes = () => {
  const storedCodesString = sessionStorage.getItem('permissionCodes');
  if (storedCodesString) {
    return JSON.parse(storedCodesString);
  } else {
    return []; // Return an empty array if no stored data found
  }
};

// Function to check if a permission code exists in stored permission codes
const hasPermission = (permissionCode) => {
  const storedPermissionCodes = getPermissionCodes();
  return storedPermissionCodes.includes(permissionCode);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const getUserid = () => {
  return localStorage.getItem('userid');
};

const isUserAuth = () => {
  const userid = getUserid();
  return !!userid;
};

const setUserBranchID = (branchid) => {
  localStorage.setItem('branchid', branchid);
};

const setUserRoleID = (userroleid) => {
  localStorage.setItem('userroleid', userroleid);
};

const getUserBranchID = () => {
  return localStorage.getItem('branchid');
};

const getUserRoleID = () => {
  return localStorage.getItem('userroleid');
};

const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

const isLogged = () => {
  const token = getToken();
  const userid = getUserid();
  return !!token && !!userid;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userid');
  window.location.reload();
};

export {
  setToken,
  getToken,
  isAuthenticated,
  logout,
  isUserAuth,
  setUserid,
  getUserid,
  isLogged,
  setUserBranchID,
  getUserBranchID,
  setUserRoleID,
  setPermissionCodes,
  hasPermission,
  getUserRoleID,
  getPermissionCodes
};
