import { layout } from "@/app";
import Admin from "@/pages/Admin";


export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/schedule', name: '日程管理', icon: 'table', component: './User/Schedule' },
  { 
    path: '/account/center', 
    layout:false,
    component: './User/SelfCenter'
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    component: './Admin',
    access: 'canAdmin',
    routes: [{ path: '/admin/user-manage', component: './Admin/UserManage' }],
  },
  // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
