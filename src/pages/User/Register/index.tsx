import { Footer } from '@/components';
import { PLANET_LINK, SYSTEM_LOGE } from '@/constants';
import { register } from '@/services/ant-design-pro/api';
import {
  AlipayCircleOutlined,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
// @ts-ignore
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
// @ts-ignore
import { Alert, Tabs, message } from 'antd';
import { createStyles } from 'antd-style';
// @ts-ignore
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('http://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ActionIcons = () => {
  const { styles } = useStyles();
  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};
// const Lang = () => {
//   const { styles } = useStyles();
//   return;
// };
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState, /*setUserLoginState*/] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.RegisterParams) => {
    try {
      const { userAccount, userPassword, checkPassword} = values;
      if (userPassword !== checkPassword) {
        message.error(`两次输入密码不一致`);
        return;
      }

      // 注册
      const promise = await register({
        userAccount,
        userPassword,
        checkPassword,
      });

      console.log(promise);
      if (promise.code === 20000 && (promise?.data || -1) > 0) {
        const defaultLoginSuccessMessage = '注册成功';
        message.success(defaultLoginSuccessMessage);
        history.push('/user/login');
        return;
      } else {
        throw new Error(promise.description);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      {/*<Lang/>*/}

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src={SYSTEM_LOGE} />}
          title="RR管理系统"
          subTitle={
            <a href={PLANET_LINK} target="_blank" rel="noreferrer">
              最好的管理系统
            </a>
          }
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码注册',
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的用户名和密码(admin/ant.design)'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder="请输入账号"
                // placeholder={intl.formatMessage({
                //   id: 'pages.login.userAccount.placeholder',
                //   defaultMessage: '请输入账号'
                // })}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '密码是必填项',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '长度不能小于8',
                  },
                ]}
              />

              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder="请再次输入密码"
                // placeholder={intl.formatMessage({
                //   id: 'pages.login.userPassword.placeholder',
                //   defaultMessage: '请输入密码',
                // })}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '长度不能小于8',
                  },
                ]}
              />

              <div
                style={{
                  marginBottom:24,
                  textAlign:"right"
                }}
              >
                已有帐号？
                <a
                  href="/user/login"
                  style={{
                    paddingRight: 10,
                  }}
                >
                  去登录
                </a>
              </div>
            </>
          )}
        </LoginForm>
      </div>

      <Footer/>
    </div>
  );
};
export default Login;
