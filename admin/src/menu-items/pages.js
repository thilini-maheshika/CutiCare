// assets
import { IconKey } from '@tabler/icons';
import { IconCalendarEvent  } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconCalendarEvent 
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  // caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'doctors',
      title: 'Doctors',
      type: 'collapse',
      icon: icons.IconCalendarEvent ,

      children: [
        {
          id: 'doctor-list',
          title: 'Doctor List',
          type: 'item',
          url: '/pages/doctor-list',
          target: true
        }
        
      ]
    },

    {
      id: 'hospital',
      title: 'Hospital',
      type: 'collapse',
      icon: icons.IconCalendarEvent ,

      children: [
        {
          id: 'hospital-list',
          title: 'Hospital List',
          type: 'item',
          url: '/pages/hospital-list',
          target: true
        }
        
      ]
    },

    {
      id: 'authentication',
      title: 'Account',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    }
  ]
};

export default pages;
