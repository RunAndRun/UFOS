<template>
  <div>
    <div v-if="items.length">
      <card class="items" v-for="item,index in items" :key="index">
        <Row type="flex" justify="space-between">
          <Col>
            <Row type="flex" :gutter="24" class="itemTit">
              <Col class="avatar" style="padding: 0">
                <img :src="item.user.avatar || avatar" alt="用户头像">
              </Col>
              <Col>
                <p class="nickname">{{item.user.nickname || 'UFOS_' + item.user._id.substr(-4).toUpperCase()}}</p>
                <p class="time">{{getTime(item)}}</p>
              </Col>
            </Row>
          </Col>
          <Col>
            <Poptip v-if="editable" placement="bottom-end" trigger="hover">
              <div slot="content" class="hover action">
                <p @click="edit(item)" class="edit">编辑</p>
                <p @click="delItem(item._id, index)" class="del">删除</p>
              </div>
              <Button icon="ios-arrow-down" type="primary" size="small"></Button>
            </Poptip>
          </Col>
        </Row>
        <p class="text">{{item.text || ''}}</p>
        <Row type="flex" v-if="item.imgs.length">
          <Col @click.native="showImage(item.imgs, index)" span="8" v-for="image, index in item.imgs" :key="index" class="imageWrapper">
            <div :style="{'backgroundImage': `url(${image})`}" class="hover img"></div>
          </Col>
        </Row>
      </card>
      <div class="end">{{this.end ? '—————— 我也是有底线的 ——————' : '加载更多 ...'}}</div>
    </div>
    <Card v-else class="emptyNote">
      <p>还没有发表的内容 ...</p>
      <p>从现在开始，记录自己的心路和梦想吧 ...</p>
      <p>梦想总是要有的，万一实现了呢 😸😸😸 ...</p>
    </Card>
    <Modal v-model="show" footer-hide :closable="false">
      <div v-if="images.length">
        <Carousel v-model="imageIndex" :height="400">
          <CarouselItem v-for="url, index in images" :key="index">
            <Row style="width: 100%;height: 100%;" type="flex" align="middle" justify="center">
              <Col style="width: 100%;height:400px;text-align: center;overflow: hidden;background: rgba(48,149,255,.3)">
                <img :src="url" style="height: 100%;width: auto">
              </Col>
            </Row>
          </CarouselItem>
        </Carousel>
      </div>
    </Modal>
  </div>
</template>

<script>
import avatar from '../assets/image/avatar.jpg'
import day from 'dayjs'

export default {
  data () {
    return {
      avatar,
      show: false,
      images: [],
      imageIndex: 0
    }
  },
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    editable: {
      type: Boolean,
      default: false
    },
    end: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    name () {
      return this.$route.name
    }
  },
  methods: {
    edit (item) {
      this.$emit('edit', item)
    },
    delItem (_id, idx) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除？',
        'onOk': async () => {
          let rs = await this.axios.post('/ufo/remove', { _id })
          if (rs.data.code === 1) {
            this.$emit('delItem', idx)
            this.$Notice.success({
              title: '删除成功'
            })
          } else {
            this.$Notice.error({
              title: rs.data.msg || '删除失败'
            })
          }
        }
      })
    },
    showImage (arr, idx) {
      this.images = arr
      this.imageIndex = idx
      this.show = true
    },
    getTime (item) {
      if (this.name === 'all') {
        return '更新时间：' + day(item.updated).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return '发表时间：' + day(item.created).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .emptyNote{
    margin-top: 20px;
    height: 300px;
    line-height: 30px;
  }
  .items{
    padding: 0 15px;
    margin-bottom: 20px;
    .itemTit{
      margin-bottom: 15px;
      .avatar{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 0 6px #3095FF;
        text-align: center;
        img{
          height: 60px;
          width: auto;
        }
      }
      .nickname{
        font-size: 16px;
      }
      .time{
        font-size: 12px;
        color: #999999;
        margin-top: 5px;
      }
      .text{
        white-space: normal;
        font-size: 14px;
      }
    }
    .imageWrapper{
      height: 240px;
      box-sizing: border-box;
      padding: 5px;
      .img{
        width: 100%;
        height: 100%;
        background-size: cover;
      }
    }
    .action{
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      letter-spacing: 2px;
      .edit{
        color: #2d8cf0;
        border-bottom: 1px solid #ededed;
      }
      .del{
        color: red;
      }
    }
  }
  .end{
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
    color: #2d8cf0;
    letter-spacing: 5px;
  }
</style>
