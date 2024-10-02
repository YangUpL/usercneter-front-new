import React, { useEffect, useState } from 'react';
import { Avatar, Button, Descriptions, Radio, message, Upload, Form, Input } from 'antd';
import type { DescriptionsProps, RadioChangeEvent, UploadProps } from 'antd';
import { UserOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp } from 'antd';
import { getInitialState } from '@/app';
import { updateUserSelf } from '@/services/ant-design-pro/api';
import { useNavigate } from 'react-router-dom';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('https://img1.baidu.com/it/u=1966616150,2146512490&fm=253&fmt=auto&app=138&f=JPEG?w=751&h=500');
  const [size, setSize] = useState<'default' | 'middle' | 'small'>('default');
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState<API.CurrentUser | undefined>(undefined); // 存储用户信息




  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await getInitialState();
        setUserInfo(result?.currentUser);
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    };

    fetchUserInfo();
  }, []);



  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const onChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };


  const navigate = useNavigate();

  const handleToHome = () => {
    navigate('/welcome');
  };

  const handleEdit = () => {
    setIsEditing(true);
  
    // 使用从后台获取的 userInfo 来填充表单
    form.setFieldsValue({
      username: userInfo?.username || '',     // 从 userInfo 获取用户名
      userAccount: userInfo?.userAccount || '', // 从 userInfo 获取用户账户
      gender: userInfo?.gender?.toString() || '', // 从 userInfo 获取性别（转为字符串）
      phone: userInfo?.phone || '',            // 从 userInfo 获取电话号码
      email: userInfo?.email || '',            // 从 userInfo 获取电子邮件
    });
  };
  

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      console.log('Updated values:', values);
      try {
        const promise = await updateUserSelf(values)

        if(promise.code === 20000 && promise.data){
          const defaultLoginSuccessMessage = '修改成功';
          message.success(defaultLoginSuccessMessage);
          // Perform save operation here

        // 更新成功后重新获取用户信息
        const updatedUserInfo = await getInitialState();
        setUserInfo(updatedUserInfo?.currentUser);

          setIsEditing(false);
        }else {
          throw new Error(promise.description);
        }
      } catch (error:any) {
        //捕获异常
        const defaultLoginFailureMessage = error.message;
        console.log(error);
        message.error(defaultLoginFailureMessage);
      }
      
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const borderedItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'username',
      children: isEditing ? (
        <Form.Item name="username" initialValue={userInfo?.username}>
          <Input />
        </Form.Item>
      ) : (
        userInfo?.username || 'Loading...'
      ),
    },
    {
      key: '2',
      label: 'userAccount',
      children: isEditing ? (
        <Form.Item name="userAccount" initialValue={userInfo?.userAccount}>
          <Input />
        </Form.Item>
      ) : (
        userInfo?.userAccount || 'Loading...'
      ),
    },
    {
      key: '3',
      label: 'gender',
      children: isEditing ? (
        <Form.Item name="gender" initialValue={userInfo?.gender?.toString()}>
          <Radio.Group>
            <Radio value="0">男</Radio>
            <Radio value="1">女</Radio>
          </Radio.Group>
        </Form.Item>
      ) : (
        (userInfo?.gender === 0 ? '男' : '女') || 'Loading...'
      ),
    },
    {
      key: '4',
      label: 'phone',
      children: isEditing ? (
        <Form.Item name="phone" initialValue={userInfo?.phone}>
          <Input />
        </Form.Item>
      ) : (
        userInfo?.phone || 'Loading...'
      ),
    },
    {
      key: '5',
      label: 'email',
      children: isEditing ? (
        <Form.Item name="email" initialValue={userInfo?.email}>
          <Input />
        </Form.Item>
      ) : (
        userInfo?.email || 'Loading...'
      ),
    },
    {
      key: '6',
      label: 'userRole',
      children: userInfo?.userRole === 0 ? '普通用户' : '管理员',  // 不可编辑
    },
    {
      key: '7',
      label: 'userStatus',
      children: userInfo?.userStatus === 0 ? '正常' : '封禁',  // 不可编辑
    },
    {
      key: '8',
      label: 'planetCode',
      children: userInfo?.planetCode || '',  // 不可编辑
    },
    {
      key: '9',
      label: 'avatar',
      children: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={64} src={imageUrl} icon={<UserOutlined />} />
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://localhost:8080/api/user/upLoadAvator"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
        </div>
      ),
    },
    {
      key: '10',
      label: 'Config Info',
      children: (
        <>
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
          <br />
        </>
      ),
    },
  ];

  return (
    <div>
      <Radio.Group onChange={onChange} value={size}>
        <Radio value="default">default</Radio>
        <Radio value="middle">middle</Radio>
        <Radio value="small">small</Radio>
      </Radio.Group>
      <br />
      <br />
      {isEditing ? (
        <>
          <Form form={form} layout="vertical">
            <Descriptions
              bordered
              title="Custom Size"
              size={size}
              items={borderedItems}
            />
          </Form>
          <Button type="primary" onClick={handleSave}>Save</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => setIsEditing(false)}>Cancel</Button>
        </>
      ) : (
        <Descriptions
          bordered
          title="Custom Size"
          size={size}
          extra={
            <div>
              <Button type='dashed' style={{marginRight: '10px'}} onClick={handleToHome}>返回主页</Button>
              <Button type="primary" onClick={handleEdit}>Edit</Button>   
            </div>
          }
          items={borderedItems}
        />
      )}

    </div>
  );
};

export default App;
