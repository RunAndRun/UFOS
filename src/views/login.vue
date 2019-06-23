<template>
  <Row class="common_wrapper" type="flex" align="middle" justify="center">
    <Col>
      <Card class="common_box" :dis-hover="true">
        <p class="common_tit">UFOS - 登录</p>
        <Form ref="form" :model="info" :rules="rules">
          <FormItem label="邮箱：" :label-width="120" prop="email">
            <Input @keydown.native.enter="login" type="text" v-model="info.email" placeholder="请输入邮箱" class="common_input" :maxlength="80"/>
          </FormItem>
          <FormItem label="密码：" :label-width="120" prop="password">
            <Input @keydown.native.enter="login" type="password" v-model="info.password" placeholder="请输入密码（6-12位）" class="common_input" :maxlength="12" />
          </FormItem>
        </Form>
        <p class="common_note">
          <span @click="goPage" class="hover">忘记密码？&nbsp;&nbsp;&nbsp;注册</span>
        </p>
        <div class="common_btn">
          <Button type="primary" long @click.native="login">登录</Button>
        </div>
      </Card>
    </Col>
    <Col class="siteInfo">
      <a href="http://www.miit.gov.cn/" target="_blank">冀ICP备18028701号-1</a>
    </Col>
  </Row>
</template>

<script>
import md5 from 'js-md5'
const emailRE = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const passwordRE = /^\w{6,12}$/

export default {
  name: 'login',
  data () {
    return {
      info: {
        email: '',
        password: ''
      },
      rules: {
        email: {
          validator: (rule, val, callback) => {
            if (!val) {
              callback(new Error('不可为空'))
              return
            }
            if (!emailRE.test(val)) {
              callback(new Error('请输入合法邮箱'))
              return
            }
            callback()
          },
          trigger: 'blur'
        },
        password: {
          validator: (rule, val, callback) => {
            if (!val) {
              callback(new Error('不可为空'))
              return
            }
            if (!passwordRE.test(val)) {
              callback(new Error('请输入6到12位有效字符'))
              return
            }
            callback()
          },
          trigger: 'blur'
        }
      }
    }
  },
  methods: {
    async login () {
      let validateRS = await this.$refs.form.validate()
      if (!validateRS) return
      let rs = await this.axios.post('/ufo/login', {
        email: this.info.email,
        password: md5(this.info.password)
      })
      if (rs.data.code === 1) {
        this.$store.commit('setUser', rs.data.data)
        this.$router.replace('/all')
      } else {
        this.$Notice.error({
          title: rs.data.msg || '登录失败'
        })
      }
    },
    goPage () {
      this.$router.replace('/register')
    }
  }
}
</script>

<style lang="scss" scoped>
  .siteInfo{
    width: 100%;
    height:70px;
    background: rgba(55,55,55,.5);
    position: fixed;
    left: 0;
    bottom: 0;
    font-size: 12px;
    box-sizing: border-box;
    text-align: center;
    line-height: 70px;
    a {
      text-decoration: none;
      color: #c3c3c3;
    }
  }
</style>
