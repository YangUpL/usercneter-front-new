import { SearchUsers, SearchUsers1 } from '@/services/ant-design-pro/api';
import { ContactsOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef } from 'react';
import request from '../../../plugin/globalRequest';
import { PageInfo } from '@ant-design/pro-components';


export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};


const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },

  {
    title: '用户名',
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
    dataIndex: 'avatar',
    render:(_ , record) => (
      <div>
        <img src={record.avatarUrl} width={30}/>
      </div>
    ),
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
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true
  },

  {
    title: '星球编号',
    dataIndex: 'planetCode',
  },


  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  function myQuery(arg0: { page: number | undefined; pageSize: number | undefined; }) {
    throw new Error('Function not implemented.');
  }

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {

        console.log(params)
        const sortField = Object.keys(sort)?.[0];
        console.log(sortField)
        const sortOrder = sort?.[sortField] ?? undefined;
        console.log(sortOrder)
        
        const {data,code} = await SearchUsers({
          ...params,
          sortField,
          sortOrder
          // filter
        })

        return{
          success:code === 20000,
          data: data || [],
        }

      }}

      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          // console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        // current:2,
        pageSize: 5,
        onChange: (page,pageSize) => console.log(page)
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>
      ]}
    />
  );
};