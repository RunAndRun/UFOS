<template>
  <div class="homeWrapper">
    <div class="header">
      <Row type="flex" justify="space-between">
        <Col span="4"></Col>
        <Col class="logo" span="9">
          <span class="logoName hover" @click="goPage('/all')">UFOS</span>
          <span class="slogan">{{user.signature || defaultSlogan}}</span>
        </Col>
        <Col class="text" v-if="!user.email" span="8">
          <span @click="goPage('/')" class="hover" style="font-size: 14px;letter-spacing: 2px">
            <Icon type="md-create" /> 记录自己
          </span>
        </Col>
        <Col class="text" v-else span="8">
          <span :class="{'active': name === 'all', 'hover': true}" @click="goPage('/all')" style="margin-right: 10px;padding: 10px">ALL</span>
          <span :class="{'active': name === 'mine', 'hover': true}" @click="goPage('/mine')" style="margin-right: 50px;padding: 10px">MINE</span>
          <Poptip placement="bottom" padding="10px" trigger="hover">
            <div slot="content" class="hover user">
              <p @click="goPage('/user')" style="border-bottom: 1px solid #e3e3e3">个人资料</p>
              <p @click="logout">退出登录</p>
            </div>
            <Avatar class="hover" :src="user.avatar || avatar" size="large"/>
          </Poptip>
        </Col>
        <Col span="3"></Col>
      </Row>
    </div>
    <transition name="fade" mode="out-in">
      <router-view class="content"></router-view>
    </transition>
  </div>
</template>

<script>
import avatar from '../assets/image/avatar.jpg'
export default {
  name: 'home',
  data () {
    return {
      defaultSlogan: 'MyDream MyLife MyWay',
      avatar
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    name () {
      return this.$route.name
    }
  },
  methods: {
    goPage (page) {
      this.$router.push(`${page}`)
    },
    logout () {
      this.$Modal.confirm({
        title: '提示',
        content: '确认退出？',
        'onOk': async () => {
          let rs = await this.axios.post('/ufo/logout')
          if (rs.data.code === 1) {
            this.$store.commit('setUser', {})
            this.$router.push('/all')
            this.$Notice.success({
              title: '已退出登录'
            })
          } else {
            this.$Notice.error({
              title: rs.data.msg || '退出失败，请重试'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .homeWrapper{
    padding-top: 70px;
    width: 100%;
    box-sizing: border-box;
    .header{
      width: 100%;
      min-width: 900px;
      height: 60px;
      line-height: 60px;
      box-sizing: border-box;
      border-bottom: 1px solid #6cd3ef;
      background: #2d8cf0;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 99;
      color: #ffffff;
      .logo{
        letter-spacing: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .logoName{
          font-size: 30px;
          font-weight: bold;
        }
        .slogan{
          font-size: 12px;
          margin-left: 20px;
        }
      }
      .text{
        font-size: 18px;
        text-align: right;
        .active{
          background: #2a62b7;
          border-radius: 12px;
        }
        .user{
          color: #333333;
          text-align: center;
          line-height: 28px;
          font-size: 14px;
        }
      }
    }
    .content{
      margin: 0 auto;
      max-width: 850px;
      min-width: 850px;
      padding-bottom: 20px;
    }
  }
</style>
