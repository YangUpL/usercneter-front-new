import { Footer } from '@/components';
import { PLANET_LINK, SYSTEM_LOGE } from '@/constants';
import { login } from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
// @ts-ignore
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { createStyles } from 'antd-style';
// @ts-ignore
import { Alert, Tabs, message } from 'antd';
// @ts-ignore
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * 页面样式
 */
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


/**
 * 用于返回登录解惑信息
 * @param content  信息内容
 * @constructor
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  console.log(content)
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

/**
 * 正式登录页面
 * 处理登录逻辑
 * @constructor
 */
const Login: React.FC = () => {

  //useState  useModel    useStyles是React的内置函数
  //用户登陆信息的状态
  // const [userLoginState, /*setUserLoginState*/] = useState<API.LoginResult>({});
    //type是登录方式  account是账号密码登录  phone是手机号登录
  const [type, setType] = useState<string>('account');

  //initialState是app.tsx的函数   fetchUserInfo获取用户信息
  const { initialState, setInitialState } = useModel('@@initialState');

  //样式
  const { styles } = useStyles();

  //initialState是app.tsx的函数   fetchUserInfo获取用户信息
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s:any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  //type是登录方式  account是账号密码登录  phone是手机号登录
  //handleSubmit是登录按钮的点击事件
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 调用登录接口 ...values是输入的参数  type是登录类型
      const promise = await login({
        ...values,
        type,
      });

        //如果登录成功  promise.code是20000  promise.data不为空
      if (promise.code === 20000 && promise.data) {

        //显示登陆成功
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);

        //登录成功后  调用fetchUserInfo获取用户信息  然后跳转到首页
        await fetchUserInfo();

        //获取url参数  如果有redirect参数  就跳转到redirect参数指定的页面  否则跳转到首页
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        //登录失败promise.code不是20000或promise.data为空
        throw new Error(promise.description);
      }
    } catch (error: any) {
      //捕获异常
      const defaultLoginFailureMessage = error.message;
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };


  return (
    <div className={styles.container}>

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >

        {/*LoginForm内定义了标题等   onFinish触发登录处理*/}
        <LoginForm
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

            //此处调用处理登录接口
            await handleSubmit(values as API.LoginParams);
          }}
        >

          {/*Tabs触发type切换 账号密码 or 手机号*/}
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },

              // {
              //   key: 'phone',
              //   label: '手机号登录',
              // },
            ]}
          />



          {/*根据type显示不同的登录方式  账号密码登录的信息*/}
          {type === 'account' && (
            <>
               <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入账号"
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
                  prefix: <LockOutlined />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '长度不能小于8',
                  },
                ]}
              />
            </>
          )}

          {/*{type === 'phone' && (*/}
          {/*  <>*/}
          {/*    <ProFormText*/}
          {/*      fieldProps={{*/}
          {/*        size: 'large',*/}
          {/*        prefix: <MobileOutlined className={'prefixIcon'} />,*/}
          {/*      }}*/}
          {/*      name="mobile"*/}
          {/*      placeholder={'手机号'}*/}
          {/*      rules={[*/}
          {/*        {*/}
          {/*          required: true,*/}
          {/*          message: '请输入手机号！',*/}
          {/*        },*/}
          {/*        {*/}
          {/*          pattern: /^1\d{10}$/,*/}
          {/*          message: '手机号格式错误！',*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*    />*/}
          {/*    <ProFormCaptcha*/}
          {/*      fieldProps={{*/}
          {/*        size: 'large',*/}
          {/*        prefix: <LockOutlined className={'prefixIcon'} />,*/}
          {/*      }}*/}
          {/*      captchaProps={{*/}
          {/*        size: 'large',*/}
          {/*      }}*/}
          {/*      placeholder={'请输入验证码'}*/}
          {/*      captchaTextRender={(timing, count) => {*/}
          {/*        if (timing) {*/}
          {/*          return `${count} ${'获取验证码'}`;*/}
          {/*        }*/}
          {/*        return '获取验证码';*/}
          {/*      }}*/}
          {/*      name="captcha"*/}
          {/*      rules={[*/}
          {/*        {*/}
          {/*          required: true,*/}
          {/*          message: '请输入验证码！',*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*      onGetCaptcha={async () => {*/}
          {/*        message.success('获取验证码成功！验证码为：1234');*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </>*/}
          {/*)}*/}



          <div
            style={{
              marginBottom: 24,
            }}
          >

            {/*回传给后台一个autoLogin字段   后台处理自动登陆的逻辑  未实现*/}
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>

            <a
              href="/user/register"
              style={{
                marginLeft: 90,
              }}
            >
              新用户注册
            </a>

            <a
              style={{
                float: 'right',
              }}
              href={PLANET_LINK}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
        <Footer />
    </div>
  );
};
export default Login;
