<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <!-- <el-col :span="4">
            <el-form-item label="检测站">
              <el-input
                style="width: 95%"
                v-model="searchObj.stationSn"
                placeholder="标题"
              ></el-input>
            </el-form-item>
          </el-col> -->

          <el-col :span="8">
            <el-form-item label="检测站">
              <el-select v-model="searchObj.stationSn" placeholder="请选择"  style="width: 95%">
                <el-option
                  v-for="item in stations"
                  :key="item.sn"
                  :label="item.name"
                  :value="item.sn">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.sn
                  }}</span>
                </el-option>
              </el-select>
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

      <el-table-column prop="stationSn" label="检测站编号" width="120" />
      <el-table-column prop="stationName" label="检测站名称" width="150" />
      <el-table-column
        prop="calItem"
        label="标定项目"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        prop="rateOld"
        label="标定前系数"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        prop="rateNew"
        label="标定后系数"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        prop="calPeople"
        label="标定人员"
        show-overflow-tooltip
        width="80"
      />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />

      <el-table-column
        prop="createTime"
        label="创建时间"
        show-overflow-tooltip
      />
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
import api from "@/api/business/busRecord";
import apistation from "@/api/business/busStation";

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

      stations: [],
    };
  },
  created() {
    //调用列表方法
    this.fetchData();
    this.getStationByUserName();
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
    getStationByUserName() {
      apistation.getStationByUserName().then((response) => {
        this.stations=response.data
      });
    },
    resetData(){
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },
  },
};
</script>

<style>
</style>
