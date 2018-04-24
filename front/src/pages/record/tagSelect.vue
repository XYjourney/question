<template>
  <div>
    <el-tag style="margin: 0px 5px 5px 0px" type="success" size="medium" v-for="(item, index) of scopeData.row.interests">{{ item }}</el-tag>
  </div>
</template>
<script>
export default {
  props: ['scopeData']
}
</script>
