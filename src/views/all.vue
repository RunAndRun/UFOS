<template>
  <div :class="{'hack': hack}">
    <contentList :items="items" :end="end"></contentList>
  </div>
</template>

<script>
import contentList from '../components/content'

export default {
  name: 'all',
  components: {
    contentList
  },
  data () {
    return {
      hack: true,
      items: [],
      skip: 0,
      diff: 0,
      end: false,
      loading: false
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
      this.loading = true
      let rs = await this.axios.post('/ufo/list', {
        skip: this.skip * 8,
        limit: 8
      })
      if (rs.data.code === 1) {
        this.items = [...this.items, ...rs.data.data]
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .hack{
    min-height: 150vh;
  }
</style>
