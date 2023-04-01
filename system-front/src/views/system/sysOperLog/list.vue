<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input
                style="width: 95%"
                v-model="searchObj.title"
                placeholder="标题"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px; width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="fetchData()"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetData"
            >重置</el-button
          >
        </el-row>
      </el-form>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="模块标题" width="120" />
      <el-table-column prop="businessType" label="业务类型" width="110" />
      <el-table-column prop="method" label="方法" show-overflow-tooltip width="120" />
      <el-table-column prop="requestMethod" label="请求方法" show-overflow-tooltip width="100"  />
      <el-table-column prop="operatorType" label="操作类型" show-overflow-tooltip width="100" />
      <el-table-column prop="operName" label="操作人"  show-overflow-tooltip width="80" />
      <el-table-column prop="operUrl" label="请求URL" show-overflow-tooltip  width="110" />
      <el-table-column prop="operIp" label="主机地址" show-overflow-tooltip width="100" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status===1">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="operParam" label="请求参数" show-overflow-tooltip />
      <el-table-column prop="jsonResult" label="返回参数" show-overflow-tooltip />
      <el-table-column prop="errorMsg" label="错误消息" show-overflow-tooltip/>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import api from "@/api/system/sysOper";
export default {
  data() {
    return {
      listLoading: false,
      list: null,
      total: 0,
      page: 1,
      limit: 20,
      searchObj: {},

      createTimes: [],
    };
  },
  created() {
    //调用列表方法
    this.fetchData();
  },
  methods: {
    //分面查询
    fetchData(page = 1) {
      this.page = page;
      if (this.createTimes && this.createTimes.length == 2) {
        this.searchObj.createTimeBegin = this.createTimes[0];
        this.searchObj.createTimeEnd = this.createTimes[1];
      }
      api
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.list = response.data.records;
          this.total = response.data.total;
        });
    },
  },
};
</script>

<style>
</style>
