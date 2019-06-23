<template>
  <div :class="{'hack': hack}">
    <edit @publish="publish('addItem')" :item.sync="addItem" style="margin-bottom: 20px"></edit>
    <contentList :items="items" @delItem="delItem" @edit="edit" :end="end" :editable="true"></contentList>
    <Modal v-model="editModal" footer-hide title=" " :styles="{'width': '800px', 'minWidth': '800px'}">
      <edit @publish="publish('editItem')" :item.sync="editItem"></edit>
    </Modal>
  </div>
</template>

<script>
import edit from '../components/edit'
import contentList from '../components/content'

export default {
  name: 'mine',
  components: {
    edit,
    contentList
  },
  data () {
    return {
      hack: true,
      items: [],
      skip: 0,
      diff: 0,
      end: false,
      loading: false,
      editModal: false,
      addItem: {
        text: '',
        imgs: []
      },
      editItem: {
        text: '',
        imgs: []
      },
      oldItem: null
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  created () {
    window.scrollTo(0, 0)
    this.getData()
  },
  mounted () {
    window.onscroll = () => {
      if (!this.diff) this.diff = document.documentElement.scrollHeight - window.innerHeight - 200
      if (this.diff <= window.pageYOffset) {
        if (!this.loading) this.getData()
      }
    }
  },
  methods: {
    async getData () {
      if (this.end) return
      if (!this.user._id) return
      this.loading = true
      let rs = await this.axios.post('/ufo/list', {
        _id: this.user._id,
        skip: this.skip * 8,
        limit: 8
      })
      if (rs.data.code === 1) {
        if (this.skip === 0) {
          this.items = [...rs.data.data]
        } else {
          this.items = [...this.items, ...rs.data.data]
        }
        if (rs.data.data.length < 8) {
          this.end = true
        } else {
          this.skip++
        }
        this.$nextTick(() => {
          this.loading = false
          this.hack = false
          this.diff = document.documentElement.scrollHeight - window.innerHeight - 200
        })
      } else {
        this.$Notice.error({
          title: rs.data.msg || '获取数据失败'
        })
      }
    },
    delItem (index) {
      this.items.splice(index, 1)
    },
    edit (item) {
      this.oldItem = item
      this.editItem = JSON.parse(JSON.stringify(item))
      this.editModal = true
    },
    publish (option) {
      if (option === 'addItem') {
        this.skip = 0
        this.end = false
        this.diff = 0
        this.getData()
      } else {
        this.editModal = false
        this.oldItem = Object.assign(this.oldItem, this.editItem)
      }
      this[option] = {
        text: '',
        imgs: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .hack{
    min-height: 150vh;
  }
</style>
