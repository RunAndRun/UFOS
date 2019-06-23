<template>
  <Row class="common_wrapper" type="flex" align="middle" justify="center">
    <Col>
      <Card class="common_box" :dis-hover="true">
        <p class="common_tit">UFOS - 注册</p>
        <Form ref="form" :model="info" :rules="rules">
          <FormItem label="邮箱：" :label-width="120" prop="email">
            <Input v-model="info.email" placeholder="请输入邮箱" class="common_input" :maxlength="80"/>
          </FormItem>
          <FormItem label="验证码：" :label-width="120" prop="code">
            <Input type="text" v-model="info.code" placeholder="请输入6位验证码" class="common_input" :maxlength="6">
            <p class="time" slot="append" v-if="send">{{time + 's'}}</p>
            <Button v-else @click.native="sendCode" type="default" slot="append">点击发送验证码</Button>
            </Input>
          </FormItem>
          <FormItem label="密码：" :label-width="120" prop="password">
            <Input type="password" v-model="info.password" placeholder="请输入密码（6-12位）" class="common_input" :maxlength="12"/>
          </FormItem>
          <FormItem label="密码：" :label-width="120" prop="pwd">
            <Input type="password" v-model="info.pwd" placeholder="请再次输入密码" class="common_input" :maxlength="12"/>
          </FormItem>
        </Form>
        <p class="common_note">
          <span @click="goPage" class="hover">已有账号，去登录</span>
        </p>
        <div class="common_btn">
          <Button type="primary" long @click.native="register">确定</Button>
        </div>
      </Card>
    </Col>
  </Row>
</template>

<script>
import md5 from 'js-md5'
const emailRE = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const passwordRE = /^\w{6,12}$/
const emailCodeRE = /^\w{6}$/

export default {
  name: 'register',
  data () {
    return {
      send: false,
      time: 30,
      info: {
        email: '', // 邮箱
        code: '', // 验证码
        password: '', // 密码
        pwd: '' // 二次输入密码
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
          trigger: 'change'
        },
        code: {
          validator: (rule, val, callback) => {
            if (!val) {
              callback(new Error('不可为空'))
              return
            }
            if (!emailCodeRE.test(val)) {
              callback(new Error('请输入合法验证码'))
              return
            }
            callback()
          },
          trigger: 'change'
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
            if (this.info.pwd && val !== this.info.pwd) {
              callback(new Error('密码不一致'))
              return
            }
            callback()
          },
          trigger: 'change'
        },
        pwd: {
          validator: (rule, val, callback) => {
            if (!val) {
              callback(new Error('不可为空'))
              return
            }
            if (!passwordRE.test(val)) {
              callback(new Error('请输入6到12位有效字符'))
              return
            }
            if (this.info.password && val !== this.info.password) {
              callback(new Error('密码不一致'))
              return
            }
            callback()
          },
          trigger: 'change'
        }
      }
    }
  },
  methods: {
    async register () {
      let validateRS = await this.$refs.form.validate()
      if (!validateRS) return
      let rs = await this.axios.post('/ufo/register', {
        email: this.info.email,
        password: md5(this.info.password),
        code: this.info.code
      })
      if (rs.data.code === 1) {
        this.$Notice.success({
          title: '注册成功，请登录'
        })
        this.$router.replace('/')
      } else {
        this.$Notice.error({
          title: rs.data.msg || '注册失败'
        })
      }
    },
    async sendCode () {
      let validateRS = ''
      this.$refs.form.validateField('email', (e) => {
        validateRS = e
      })
      if (validateRS) return
      this.send = true
      let id = setInterval(() => {
        if (this.time <= 0) {
          clearInterval(id)
          this.time = 30
          this.send = false
        } else {
          this.time--
        }
      }, 1000)
      let rs = await this.axios.post('/ufo/sendCode', {
        email: this.info.email
      })
      if (rs.data.code === 1) {
        this.$Notice.success({
          title: '验证码已发送，请查收。'
        })
      } else {
        this.$Notice.error({
          title: rs.data.msg || '验证码发送失败，请稍后重试！'
        })
      }
    },
    goPage () {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped>
  .time{
    width: 120px;
    text-align: center;
    color: #2d8cf0;
    font-weight: 700;
  }
</style>
