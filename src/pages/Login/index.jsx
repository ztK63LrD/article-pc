import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card,Form,Input,Checkbox,Button,message } from 'antd'
import useStore from '../../store'
import logo from '../../assets/logo.jpg'
import './index.scss'
// Form.Item的简写形式
const Item = Form.Item

const Login = () => {
  const navigate = useNavigate()
  const { LoginStore } = useStore()
  // 获取表单数据
  const onFinish = async(values) =>{
    const { mobile,code } = values
    try {
      // 登录 
      await LoginStore.getToken ({mobile,code})
      // 跳转首页
      navigate('/',{replace:true})
      // 提示用户登录成功
      message.success('登录成功！')
    } catch (error) {
      message.error(error.response?.data.message || '登录失败')
    }

  }
  return (
    <div className='login'>
      <Card className='login-container'>
        <img src={logo} alt="图片" className='login-logo' />
        {/* 登录表单 */}
        <Form validateTrigger={['onBlur','onChange']} onFinish={onFinish} initialValues={{remember: true}}>
          <Item name='mobile' rules={[
            { required:true,message:'请输入手机号' },
            { pattern:/^1[3-9]\d{9}$/, // 设置正则匹配规则
              validateTrigger:'onBlur', // 设置触发时机失去焦点时触发
              message:'请输入正确的手机号格式' }
          ]}>
            <Input size='large' placeholder='请输入手机号' />
          </Item> 
          <Item name='code' rules={[
            { required:true,message:'请输入密码' },
            { len:6, // 设置密码长度为6位数
              validateTrigger:'onBlur',
              message:'请输入8位密码' }
          ]}>
            <Input size='large' placeholder='请输入密码' />
          </Item>
          <Item 
            name="remember"
            valuePropName='checked'
          >
            <Checkbox className='login-checkbox-label'>
              我已经阅读并同意 [用户协议] 和 [隐私条款]
            </Checkbox>
          </Item>
          <Item>
            <Button type='primary' htmlType='submit' size='large' block>登录</Button>
          </Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login