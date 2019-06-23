<template>
  <div>
    <Card :dis-hover="true">
      <div>
        <Input type="textarea" v-model="newItem.text" :rows="3" :maxlength="500" placeholder="Enter something..." class="input"/>
      </div>
      <Row type="flex" align="middle" class="inputFooter" justify="space-between">
        <Col>
          <Poptip @on-popper-show="fillEmoji" :width="300" placement="bottom-start" padding="10px 0px 10px 10px">
            <div slot="content" class="hover emojiWrapper">
              <Row type="flex" :gutter="20">
                <Col @click.native="addEmoji(item)" span="4" v-for="item, index in emojiPre" :key="index">{{item}}</Col>
                <div v-if="render">
                  <Col @click.native="addEmoji(item)" span="4" v-for="item, index in emojiMore" :key="emojiMore.length + index">{{item}}</Col>
                </div>
              </Row>
            </div>
            <Icon class="hover" type="md-happy" size="24" color="#3095FF" />
          </Poptip>
          &nbsp;&nbsp;
          <Icon @click="selectImage" class="hover" type="md-camera" size="24" color="#3095FF" />
          <input @change="upImage" ref="file" type="file" accept="image/gif,image/jpg,image/png,image/jpeg" class="up">
        </Col>
        <Col>
          <Button @click.native="publish" type="primary" icon="md-create">发布</Button>
        </Col>
      </Row>
      <Row type="flex" v-if="newItem.imgs.length" class="images">
        <Col span="4" v-for="image, index in newItem.imgs" :key="index" class="editImageWrapper">
          <div :style="{'backgroundImage': `url(${image})`}" class="img">
            <Button @click.native="delImage(index)" class="close" type="error" shape="circle" icon="md-close" size="small"></Button>
          </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import emoji from '../assets/emoji.js'

export default {
  data () {
    return {
      render: false,
      emojiPre: emoji.pre,
      emojiMore: emoji.more,
      newItem: {
        text: '',
        imgs: []
      }
    }
  },
  props: {
    item: {
      type: Object
    }
  },
  watch: {
    item (val) { // 编辑一条数据
      this.newItem = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    selectImage () {
      let input = this.$refs.file
      input.value = null
      input.click()
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
        this.newItem.imgs.push(rs.data.data)
      } else {
        this.$Notice.error({
          title: rs.data.msg || '上传失败'
        })
      }
    },
    delImage (idx) {
      this.newItem.imgs.splice(idx, 1)
    },
    async publish () {
      if (!this.newItem.text) {
        this.$Notice.warning({
          title: '请写下此刻的心情 ...'
        })
        return
      }
      let rs = await this.axios.post('/ufo/edit', this.newItem)
      if (rs.data.code === 1) {
        this.$Notice.success({
          title: '发布成功'
        })
        this.$emit('update:item', this.newItem)
        this.$emit('publish')
      } else {
        this.$Notice.error({
          title: rs.data.msg || '发布失败'
        })
      }
    },
    addEmoji (emoji) {
      this.newItem.text += emoji
    },
    fillEmoji () {
      let id = setTimeout(() => {
        this.render = true
        clearTimeout(id)
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
  .input{
    width: 100%;
  }
  .inputFooter{
    margin-top: 15px;
    .up{
      width: 0px;
      height: 0px;
      opacity: 0;
    }
    .emojiWrapper{
      height: 300px;
      overflow-y: auto;
      overflow-x: hidden;
      font-size: 16px;
      padding-right: 20px;
      line-height: 30px;
    }
  }
  .images{
    margin-top: 10px;
    border-top: 1px solid #2d8cf0;
    .editImageWrapper{
      height: 150px;
      box-sizing: border-box;
      padding: 15px 10px 10px;
      .img{
        width: 100%;
        height: 100%;
        background-size: cover;
        position: relative;
        .close{
          position: absolute;
          right: -10px;
          top: -10px;
          z-index: 99;
        }
      }
    }
  }
</style>
