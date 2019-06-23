<template>
  <Row class="common_wrapper" type="flex" align="middle" justify="center">
    <Col>
      <Card :dis-hover="true" class="infoBox" :padding="30">
      <p class="infoTit">个人资料</p>
      <Row class="item" type="flex" justify="center" :gutter="30">
        <Col class="name" span="4">头像：</Col>
        <Col class="value" span="10">
        <div class="avatar">
          <img @click="showImage" :src="info.avatar || avatar" alt="" class="img hover">
          <input @change="upImage" class="up" ref="up" type="file" accept="image/jpg,image/png,image/jpeg"/>
        </div>
        </Col>
      </Row>
      <Row class="item" type="flex" justify="center" :gutter="30">
        <Col class="name" span="4">用户昵称：</Col>
        <Col class="value" span="10">
        <Input v-model="info.nickname" placeholder="请输入用户昵称" :maxlength="15" />
        </Col>
      </Row>
      <Row class="item" type="flex" justify="center" :gutter="30">
        <Col class="name" span="4">年龄：</Col>
        <Col class="value" span="10">
        <InputNumber v-model="info.age" :max="100" :min="1" placeholder="年龄"></InputNumber>
        </Col>
      </Row>
      <Row class="item" type="flex" justify="center" :gutter="30">
        <Col class="name" span="4">性别：</Col>
        <Col class="value" span="10">
        <RadioGroup v-model="info.sex">
          <Radio label="1">男</Radio>
          <Radio label="2">女</Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row class="item" type="flex" justify="center" :gutter="30">
        <Col class="name" span="4">个人签名：</Col>
        <Col class="value" span="10">
        <Input v-model="info.signature" placeholder="请输入喜欢的一句话" :maxlength="30" />
        </Col>
      </Row>
      <Row class="item" type="flex" justify="center" :gutter="30">
        <Col class="name" span="4">地址：</Col>
        <Col class="value" span="10">
        <Row type="flex" align="middle" :gutter="10" justify="start">
          <Col span="8">
            <Select v-model="info.provinceId" placeholder="请选择省份" style="max-width: 100%">
              <Option style="max-width: 100%" v-for="item, index in regions[1]" :value="item.id" :key="index" :label="item.area_name"></Option>
            </Select>
          </Col>
          <Col span="8">
            <Select v-model="info.cityId" placeholder="请选择城市" style="max-width: 100%">
              <Option style="max-width: 100%" v-for="item, index in regions[info.provinceId]" :value="item.id" :key="index" :label="item.area_name"></Option>
            </Select>
          </Col>
          <Col span="8">
            <Select id="region" v-model="info.regionId" placeholder="请选择区域" style="max-width: 100%;">
              <Option style="max-width: 100%" v-for="item, index in regions[info.cityId]" :value="item.id" :key="index" :label="item.area_name"></Option>
            </Select>
          </Col>
        </Row>
        </Col>
      </Row>
      <Row type="flex" justify="center" :gutter="80">
        <Col>
        <Button type="default" @click="back">返回</Button>
        </Col>
        <Col>
        <Button type="primary" @click="save">保存</Button>
        </Col>
      </Row>
    </Card>
    </Col>
  </Row>
</template>

<script>
import avatar from '../assets/image/avatar.jpg'
export default {
  name: 'userInfo',
  data () {
    return {
      send: false,
      time: 60,
      initInfo: {
        avatar: null,
        nickname: null,
        sex: null,
        age: null,
        signature: null,
        provinceId: null,
        cityId: null,
        regionId: null
      },
      info: {},
      regions: {},
      avatar
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  created () {
    this.info = Object.assign({}, this.initInfo, this.user)
    this.info.age = Number(this.info.age) || null
    import(/* webpackChunkName: "region" */ '../assets/region').then(regions => {
      this.regions = regions.default
    })
  },
  methods: {
    back () {
      this.$router.back()
    },
    async save () {
      let params = Object.assign({}, this.info)
      if (params.age) params.age = params.age.toString()
      let rs = await this.axios.post('/ufo/userInfo', params)
      if (rs.data.code === 1) {
        this.$store.commit('setUser', Object.assign({}, this.user, rs.data.data))
        this.$Notice.success({
          title: '保存成功'
        })
      } else {
        this.$Notice.error({
          title: rs.data.msg || '保存失败，请重试'
        })
      }
    },
    showImage () {
      let dom = this.$refs.up
      dom.value = null
      dom.click()
    },
    async upImage (e) {
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('file', file)
      let rs = await this.axios.post('/ufo/upImage', formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      if (rs.data.code === 1) {
        this.info = Object.assign({}, this.info, { avatar: rs.data.data })
      } else {
        this.$Notice.error({
          title: rs.data.msg || '上传失败'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .infoBox {
    width: 900px;
    min-width: 900px;
    .infoTit {
      font-size: 28px;
      text-align: center;
      margin-bottom: 30px;
      color: #2d8cf0;
    }
    .item{
      margin-bottom: 30px;
      .name {
        text-align: right;
      }
      .value{
        .avatar{
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          text-align: center;
          box-shadow: 0 0 8px #2d8cf0;
          .img{
            width: auto;
            height: 100%;
          }
          .up{
            width: 0px;
            height: 0px;
            opacity: 0;
          }
        }
      }
    }
  }
</style>
