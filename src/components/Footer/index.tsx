import { PLANET_LINK } from '@/constants';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: '用户管理中心',
          title: 'RR用户管理',
          href: PLANET_LINK,
          blankTarget: true,
        },

        {
          key: 'Author',
          title: 'YangRR',
          href: 'http://ant.design',
          blankTarget: true,
        },

        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'http://github.com/yangUpL',
          blankTarget: true,
        },
        
      ]}
    />
  );
};

export default Footer;
