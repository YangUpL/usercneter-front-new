import { AvatarDropdown, AvatarName, Footer, Question } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import { LinkOutlined } from '@ant-design/icons';
// @ts-ignore
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
// @ts-ignore
import { SettingDrawer } from '@ant-design/pro-components';
// @ts-ignore
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const NO_NEED_LOGIN_WHITE_LIST = ['/user/register', loginPath];

/**
 * @see  http://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // alert(process.env.NODE_ENV);
  const fetchUserInfo = async () => {
    try {
      const promise = await queryCurrentUser({
        skipErrorHandler: true,
      });

      console.log(promise.data)
      return promise.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，不执行currentUser
  const { location } = history;
  if (NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)) {

    return {
      fetchUserInfo,
      settings: defaultSettings as Partial<LayoutSettings>,
    };


  }

  const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };

}

// ProLayout 支持的api http://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.currentUser?.avatarUrl,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)) {
        return;
      }

      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'http://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'http://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'http://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc http://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...errorConfig,
  timeout: 10000,
  // baseURL: "http://localhost:8080/",
};
