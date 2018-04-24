<template>
  <div class="ref">
    <div class="head">
      <b><span>参考资料</span></b>
    </div>
    <div>
      <template v-for="(item, index) of references">
        <div :key="index">
          <a :href="item.link" target="_blank"> {{ item.label }} </a>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: [],
  data () {
    return {
      references: [
        {
          link: 'http://www.baidu.com',
          label: '百度'
        },
        {
          link: 'http://www.163.com',
          label: '网易'
        }
      ]
    }
  }
}
</script>
<style lang="less">
.ref {
  text-align: center;
  .head {
    font-size: 18px;
    margin: 20px;
  }
}
</style>
