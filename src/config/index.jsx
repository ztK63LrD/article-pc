import { Link } from 'react-router-dom'
import { HomeOutlined,DiffOutlined,EditOutlined } from '@ant-design/icons';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem(<Link to='/layout/home'>数据概览</Link>, '/layout/home', <HomeOutlined />),
  getItem(<Link to='/layout/article'>内容管理</Link>, '/layout/article', <DiffOutlined />),
  getItem(<Link to='/layout/publish'>发布文章</Link>, '/layout/publish', <EditOutlined />),

];

export default items