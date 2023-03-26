// 把所有模块进行一个统一的处理，导出一个统一的方法 useStore
import React from "react";
import LoginStore from "./login";
import UserStore from './username'
import ChannelStore from "./channels";

class RootStore {
  constructor(){
    this.LoginStore = new LoginStore()
    this.UserStore = new UserStore()
    this.ChannelStore = new ChannelStore()
  }
}

// 实例化根 导出useStore context
const rootStore = new RootStore()
const context = React.createContext(rootStore)

const useStore = () => React.useContext(context)

export default useStore