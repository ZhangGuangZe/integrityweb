<template>
  <div class="dashboard-container">
    <section>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>景区导游</span>
        </div>
        <travelGuide />
      </el-card>
    </section>

    <section>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>景区旅行社</span>
        </div>
        <travelAgency />
      </el-card>
    </section>

    <section>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>红黑榜</span>
        </div>
        <redBlock />
      </el-card>
    </section>

    <section>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>我要投诉</span>
        </div>
        <complaint />
      </el-card>
    </section>
  </div>
</template>

<script>
import travelGuide from '@/views/dashboard/travelGuide'
import travelAgency from '@/views/dashboard/travelAgency'
import redBlock from '@/views/dashboard/redBlock'
import complaint from '@/views/dashboard/complaint'
export default {
  name: 'Dashboard',
  components: { travelGuide, travelAgency, redBlock, complaint }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  section{
    margin-bottom: 20px;
  }
</style>
