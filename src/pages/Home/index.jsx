import React from 'react'
import Bar from '../../components/Bar'
import './index.scss'

const Home = () => {
  return (
    <div className='home'>
      {/* 渲染Bar组件 */}
      <Bar
        title='主流框架满意度'
        xData={['react', 'vue', 'angular']}
        yData={[30, 40, 50]}
        style={{ width: '500px', height: '400px' }} />
      <Bar
        title='主流框架使用度'
        xData={['react', 'vue', 'angular']}
        yData={[60, 70, 80]}
        style={{ width: '500px', height: '400px' }} />
    </div>
  )
}

export default Home