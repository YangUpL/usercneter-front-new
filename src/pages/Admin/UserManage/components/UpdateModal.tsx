import { updateUser } from '@/services/ant-design-pro/api';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { message, Modal } from 'antd';
import React from 'react';


interface Props {
  oldData?: API.UpdateUser;
  visible: boolean;
  columns: ProColumns<API.UpdateUser>[];
  onSubmit: (values: API.UpdateUser) => void;
  onCancel: () => void;
}


/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UpdateUser) => {
  console.log(fields)
  const hide = message.loading('正在更新');

  try {
    const promise = await updateUser(fields);

    if(promise.code === 20000){
      hide();
      message.success('更新成功');
      return true;
    }else{
      throw new Error(promise.description);
    }
  } catch (error: any) {
    hide();
    message.error('更新失败，' + error.message);
    return false;
  }
};

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { oldData, visible, columns, onSubmit, onCancel } = props;

  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        form={{
          initialValues: oldData,
        }}
        onSubmit={async (values: API.UpdateUser) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id as any,
          });
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default UpdateModal;
