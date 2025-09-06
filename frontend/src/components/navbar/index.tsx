import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styles from './index.module.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      theme="light"
      selectedKeys={[location.pathname]}
      className={styles.menu}
    >
        <Menu.Item key="/overview" style={{height: '3rem', borderRadius: '0.5rem'}}>
          <Link to="/overview"><p>Обзор</p></Link>
        </Menu.Item>

      <Menu.Item key="/list" style={{height: '3rem', borderRadius: '0.5rem'}}>
        <Link to="/list"><p>Список операций</p></Link>
      </Menu.Item>
      
      <Menu.Item key="/other" style={{alignSelf: 'center', height: '3rem', borderRadius: '0.5rem'}}>
        <Link to="/other"><p>Анализ</p></Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
