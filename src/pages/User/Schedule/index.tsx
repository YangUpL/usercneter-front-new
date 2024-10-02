import { deleteSchedule, getSchedule, saveSchedule } from '@/services/ant-design-pro/api';
import type { ProColumns } from '@ant-design/pro-components';
import {
  EditableProTable,
  ProCard,
  ProFormField,
  ProFormRadio,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { toNumber } from 'lodash';

import React, { useState } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const defaultData: API.DataSourceType[] = [];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly API.DataSourceType[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom',
  );

  const columns: ProColumns<API.DataSourceType>[] = [
    {
      title: '日程名称',
      dataIndex: 'title',
      // tooltip: '只读，使用form.getFieldValue获取不到值',
      tooltip: '这里是你的日程名称',
      formItemProps: (form, { rowIndex }) => {
        // console.log(rowIndex)
        return {
          rules:
            [{ required: true, message: '此项为必填项' }],
        };
      },
      // // 第一行不允许编辑
      // editable: (text, record, index) => {
      //   console.log(index)
      //   console.log(text)
      //   console.log(record)
      //   return index !== 0;
      // },
      width: '15%',
    },
    {
      title: '日程描述',
      dataIndex: 'description',
      width:'35%',
      fieldProps: (form, { rowKey, rowIndex }) => {
        if (form.getFieldValue([rowKey || '', 'title']) === '不好玩') {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: '完成状态',
      sorter:true,
      key: 'state',
      width:'10%',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        // all: { text: '全部', status: 'Default' },
        0: {
          text: '未完成',
          status: 'Error',
        },
        1: {
          text: '已完成',
          status: 'Success',
        },
      },
    },

    {
      title: '截止时间',
      dataIndex: 'deadline',
      sorter:true,
      valueType: 'dateTime',
      width:'15%',
    },
    {
      title: '操作',
      valueType: 'option',
      width: '25%',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            if(confirm("确定删除此项？")){
              deleteSchedule(record.id);
              setDataSource(dataSource.filter((item) => item.id !== record.id));
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable<any>
        rowKey="id"
        headerTitle="RR日程管理"
        maxLength={50}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={
          position !== 'hidden'
            ? {
                position: position as 'top',
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
              }
            : false
        }
        loading={false}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value),
            }}
            options={[
              {
                label: '添加到顶部',
                value: 'top',
              },
              {
                label: '添加到底部',
                value: 'bottom',
              },
              {
                label: '隐藏',
                value: 'hidden',
              },
            ]}
          />,
        ]}
        columns={columns}
        request={
            async (params, sort, filter) => {
              try{

                const sortField = Object.keys(sort)?.[0];
                console.log(sortField)
                const sortOrder = sort?.[sortField] ?? undefined;
                console.log(sortOrder)

                    const {code,data} = await getSchedule({
                      sortField,
                      sortOrder,
                    })
                    if(code === 20000 && data){
                        const updatedData = data.map((item:API.DataSourceTypeResp) => {
                        const { isDelete, ...rest } = item; // 将isDelete字段从item中移除
                        return {
                          ...rest,
                        };
                      });
                      
                      setDataSource(updatedData);
                    }
                  return( 
                    {
                      data: dataSource,
                      total: data.length,
                      success: true,
                    }
                  ) as any
              }catch(error:any){
                  //捕获异常
                  const defaultLoginFailureMessage = error.message;
                  console.log(error);
                  message.error(defaultLoginFailureMessage);
              }        
            }
        }
        value={dataSource}
        onChange={setDataSource}
        
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            // console.log(rowKey);
            // console.log(data);
            // console.log(row);
            await waitTime(1000);
            
            try {
              // 记住！！ 发请求可以多字段！但是类型必须匹配
                const promise = await saveSchedule(data)

                if(promise.code === 20000){
                  message.success("success");
                  
                }else{
                  throw new Error(promise.description)
                }
            } catch (error:any) {
                const defaultLoginFailureMessage = error.message;
                console.log(error);
                message.error(defaultLoginFailureMessage);
            }
          },
          onDelete:async (rowKey, row) => {
            console.log(row.id)
            deleteSchedule(row.id);
          },
          onChange: setEditableRowKeys
        }}
      />
      
      {/* <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard> */}
    </>
  );
};