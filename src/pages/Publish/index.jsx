import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Card,Breadcrumb,Form,Button,Radio,Input,Upload,Space,Select,message} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import useStore from '../../store'
import http from '../../utils/http'

const { Option } = Select
const Item = Form.Item

const Publish = () => {
  const navigate = useNavigate()
  // 获取频道数据
  const { ChannelStore } = useStore()
  // 存放上传图片的列表
  const [fileList,setFileList] = useState([])
  // 保存的图片数量
  const [imgCount,setImgCount] = useState(1)
  // 声明图片的暂存仓库
  const cacheImgList = useRef()

  // 获取表单数据
  const onFinish = async(values) =>{ 
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = values
    // 判断type fileList 是匹配的才能正常提交
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    } else {
      await http.post('/mp/articles?draft=false', params)
    }

    // 跳转列表 提示用户
    navigate('/layout/article')
    message.success(`${id ? '更新成功' : '发布成功'}`)
  }
  const onUploadChange = ({fileList}) =>{ 
    // 这里关键位置:需要做数据格式化
    const formatList = fileList.map(file => {
      // 上传完毕 做数据处理
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      // 否则在上传中时，不做处理
      return file
    })
    // 存放data数据
    setFileList(formatList)
    // 同时把图片列表存入仓库一份
    cacheImgList.current = formatList
  }
  // 切换图片
  const radioChange = (e) =>{ 
    const rawValue = e.target.value
    setImgCount(rawValue)
    console.log(cacheImgList.current);
    // 从仓库里面获取对应的图片数量 交给用来渲染图片的fileList
    if(cacheImgList.current === undefined || 0){
      return false
    }
    if( rawValue === 1 ){
      const img = cacheImgList.current ? cacheImgList.current[0] : []
      setFileList([img])
    }else if ( rawValue === 3 ){
      setFileList(cacheImgList.current)
    }
  }
  // 编辑功能 文案适配 路由参数id 判断条件
  const [params] = useSearchParams()
  const id = params.get('id')
  // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      const data = res.data
      // 表单数据回填
      form.current.setFieldsValue({ ...data, type: data.cover.type })
      // 回填upload
      const formatImgList = data.cover.images.map(url => ({ url }))
      setFileList(formatImgList)
      // 暂存列表里也存一份
      cacheImgList.current = formatImgList
      // 图片type
      setImgCount(data.cover.type)
    }
    // 必须是编辑状态 才可以发送请求
    if (id) {
      loadDetail()
    }
  }, [id, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">" items={[
            {title:<Link to="/layout/home">首页</Link>},
            {title:`${id ? '编辑' : '发布'}文章`}
          ]} />
        }
      >
        <Form ref={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ type: 1, content: ''}} onFinish={onFinish}>
          <Item label="标题" name="title" rules={[{ required: true, message: '请输入文章标题' }]}>
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Item>
          <Item label="频道" name="channel_id" rules={[{ required: true, message: '请选择文章频道' }]}>
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {ChannelStore.channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}
            </Select>
          </Item>
          <Item label="封面">
            <Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Item>
            { imgCount > 0 && (
              <Upload name='image' listType='picture-card' className='avatar-uploader' showUploadList
                action="http://geek.itheima.net/v1_0/upload" fileList={fileList} onChange={onUploadChange}
                multiple={ imgCount > 1 } maxCount={ imgCount } >
                <div style={{marginTop:8}}>
                  <PlusOutlined />
                </div>
              </Upload>)
            }
  
          </Item>
          {/* 这里的富文本组件 已经被Item控制 */}
          {/* 它的输入内容 会在onFinished回调中收集起来 */}
          <Item label="内容" name="content" rules={[{ required: true, message: '请输入文章内容' }]}>
            <ReactQuill theme="snow" />
          </Item>
          <Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                { id ? '更新' : '发布' }文章
              </Button>
            </Space>
          </Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)