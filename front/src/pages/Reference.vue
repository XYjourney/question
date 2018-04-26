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
          link: 'https://www.yiibai.com/mongodb/mongodb_quick_guide.html',
          label: 'MongoDB快速入门'
        },
        {
          link: 'http://mongoosejs.com/docs/guide.html',
          label: 'MongooseAPI'
        },
        {
          link: 'https://www.cnblogs.com/zhongweiv/p/mongoose.html#mg_update',
          label: 'Mongoose介绍和入门'
        },
        {
          link: 'http://ourjs.com/detail/53ad24edb984bb4659000013',
          label: 'Mongoose学习参考文档'
        },
        {
          link: 'https://mp.weixin.qq.com/s/4btZvc9YpIRGLIOFU4Dyyg',
          label: 'MongoDB初见指南（部分原理）'
        },
        {
          link: 'https://draveness.me/mongodb-wiredtiger?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io',
          label: '浅入浅出MongoDB 和 WiredTiger'
        },
        {
          link: 'https://yq.aliyun.com/articles/64352?spm=5176.8091938.0.0.oAHbxp',
          label: 'MongoDB应用'
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
