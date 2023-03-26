import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Table, Space, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import locale from 'antd/es/date-picker/locale/zh_CN'
import useStore from '../../store'
import { http } from '../../utils'
import img404 from '../../assets/error.jpg'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  // 路由导航
  const navigate = useNavigate()
  // 文章列表管理
  const [articleData,setArticleData] = useState({
    list:[], // 文章列表
    count:0 // 文章数量
  })
  // 文章参数管理
  const [params,setParams] = useState({
    page:1,
    per_page:10
  })
  // 获取频道管理的数据
  const { ChannelStore } = useStore()

  useEffect(()=>{
    // 获取文章列表数据
    const loadList = async () =>{ 
      const res = await http.get('/mp/articles',{ params })
      const { results,total_count } = res.data
      setArticleData({
        list:results,
        count:total_count
      })
    }
    loadList()
  },[params])
  
  const onFinish = (values) =>{ 
    console.log(values);
    // 获取表单数据
    const { channel_id,date,status } = values
    // 数据处理
    const _params = {}
    if(status !== -1){
      _params.status = status
    }
    if(channel_id){
      _params.channel_id = channel_id
    }
    if(date){
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params数据 引起接口的重新发送 对象的合并是一个整体覆盖 改了对象的整体引用
    setParams({
      ...params,
      ..._params
    })
  }
  // 翻页实现
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  // 删除文章
  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // 刷新一下列表
    setParams({
      ...params,
      page: 1
    })
  }

  // 编辑文章
  const goPublish = (data) => {
    navigate(`/layout/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)} 
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
          </Space>
        )
      },
      fixed: 'right'
    }
  ]

  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">" items={[
            {title:<Link to="/layout/home">首页</Link>},
            {title:'内容管理'}
          ]} />
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onFinish}
          initialValues={{ status: '' }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value=''>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {ChannelStore.channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagination={
            {
              pageSize: params.per_page,
              total: articleData.count,
              onChange: pageChange,
              current: params.page
            }
          }
        />
      </Card>
    </div>
  )
}

export default observer(Article)