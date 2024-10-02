// @ts-ignore
import { useRef, useState } from 'react';
import { deleteUserById, SearchUsers} from '@/services/ant-design-pro/api';
import {PlusOutlined } from '@ant-design/icons';
// @ts-ignore
import type { ActionType, ProColumns, RequestData } from '@ant-design/pro-components';
// @ts-ignore
import { PageContainer, ProTable,} from '@ant-design/pro-components';
// @ts-ignore
import { Button, message, Space, Typography } from 'antd';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';



const UserAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  //控制下方自动刷新
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.CurrentUser>();

    /**
     * 删除节点
     *
     * @param row
     */
    const handleDelete = async (row: API.CurrentUser) => {
      let flag = window.confirm("确定删除？")
      if(flag){
        const hide = message.loading('正在删除');
        if (!row) return true;
        try {
          await deleteUserById({
            id: row.id as any,
          });
          hide();
          message.success('删除成功');
          actionRef?.current?.reload();
          return true;
        } catch (error: any) {
          hide();
          message.error('删除失败，' + error.message);
          return false;
        }
      }

    };

  const columns: ProColumns<API.CurrentUser>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
    },

    {
      title: '用户昵称',
      dataIndex: 'username',
      copyable: true,
    },


    {
      title: '用户账户',
      dataIndex: 'userAccount',
      copyable: true,
    },


    {
      title: '头像',
      dataIndex: 'avatarUrl',
      render:(_ , record) => (
        <div>
          <img src={record.avatarUrl} width={30}/>
        </div>
      ),
      hideInSearch: true,
      copyable: true,
    },

    {
      title: '性别',
      dataIndex: 'gender',

      valueType: 'select',
      valueEnum: {
        0: {text:'男'},
        1: {text:'女'},
      },
    },

    {
      title: '电话',
      dataIndex: 'phone',
      copyable: true,
    },


    {
      title: '邮件',
      dataIndex: 'email',
      copyable: true,
    },


    {
      title: '状态',
      dataIndex: 'userStatus',
      valueEnum: {
        0: {text:'正常',status:'success'},
        1: {text:'封禁',status:'default'}
      }
    },

    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'select',
      valueEnum: {
        0: {text:'用户',color:'blue'},
        1: {text:'管理员',color:'red'}
      }
    },

    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      hideInForm:true  //修改不显示
    },

    {
      title: '编号',
      dataIndex: 'planetCode',
      width: 48,
      hideInSearch: true,
      hideInForm:true,
    },


    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={
              () => {

                // console.log(record)
                handleDelete(record)
              }
            }>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

    return (
      <PageContainer>
        <ProTable<API.CurrentUser>
          headerTitle={'查询表格'}
          actionRef={actionRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
      
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCreateModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}


          columns={columns}
          cardBordered
          request={async (params, sort, filter) => {

            console.log(params)
            const sortField = Object.keys(sort)?.[0];
            // console.log(sortField)
            const sortOrder = sort?.[sortField] ?? undefined;
            // console.log(sortOrder)

            const promise = await SearchUsers({

            // const {data,code} = await SearchUsers({
              ...params,
              sortField,
              sortOrder,
              filter
            })

            const data = promise.data;
            const code = promise.code;


            // console.log(promise)

            return{
              success:code === 20000,
              data: data || [],
            } as RequestData<API.CurrentUser>

          }}
        />


        <CreateModal
            visible={createModalVisible}
            columns={columns}
            onSubmit={() => {
              setCreateModalVisible(false);
              actionRef.current?.reload();
            }}
            onCancel={() => {
              setCreateModalVisible(false);
            }}
        />

        <UpdateModal
          visible={updateModalVisible}
          columns={columns}
          oldData={currentRow}
          onSubmit={() => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
         />
      </PageContainer>
    );
  };

export default UserAdminPage;
