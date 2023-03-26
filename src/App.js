import React,{Suspense} from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './router'
import Loading from './pages/Loading'

const App = () => {
  // 根据路由表生成路由规则
  const element = useRoutes(routes)
  return (
    <div style={{height:'100vh'}}>
      {/* Suspense组件需要fallback传入一个组件或者HTML标签来进行懒加载效果的应急 */}
      <Suspense fallback={<Loading />}>
        {/* 展示区 */}
        {element}
      </Suspense>
    </div>
  )
}

export default App