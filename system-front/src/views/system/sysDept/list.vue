<template>
  <div class="app-container">

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add()">添 加</el-button>
    </div>
    <el-table
      :data="sysDataList"
      style="width: 100%;margin-bottom: 20px;margin-top: 10px;"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children'}">

      <el-table-column prop="name" label="部门名称ssss" width="160"/>
      <el-table-column prop="leader" label="负责人" width="160"/>
      <el-table-column prop="phone" label="电话" width="120"/>
      <el-table-column prop="sortValue" label="排序" width="60"/>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.type !== 2" icon="el-icon-plus" size="mini" @click="add(scope.row)" title="添加下级节点"/>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除" :disabled="scope.row.children.length > 0"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysData" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="上级部门" v-if="sysData.id === ''">
          <el-input v-model="sysData.parentName" disabled="true"/>
        </el-form-item>

        <el-form-item label="部门名称" prop="name">
          <el-input v-model="sysData.name"/>
        </el-form-item>

        <el-form-item label="负责人" prop="leader">
          <el-input v-model="sysData.leader"/>
        </el-form-item>

         <el-form-item label="联系电话" prop="phone">
          <el-input v-model="sysData.phone"/>
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="sysData.sortValue" controls-position="right" :min="0" />
        </el-form-item>

        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="sysData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import api from '@/api/system/sysDept'
const defaultForm = {
  id: '',
  parentId: '',
  name: '',
  leader: '',
  phone: '',
  sortValue: 1,
  status: 1
}
export default {
  // 定义数据
  data() {
    return {
      sysDataList: [],
      expandKeys: [], // 需要自动展开的项
      dialogTitle: '',
      dialogVisible: false,
      sysData: defaultForm,
      saveBtnDisabled: false,
    }
  },

  //当页面加载时获取数据
  created() {
    this.fetchData()
  },

  methods: {
    //调用api层获取数据库中的数据
    fetchData() {
      console.log('加载列表')
      api.findNodes().then(response => {
        this.sysDataList = response.data
        console.log(this.sysDataList)
      })
    },

    //根据id删除数据
    removeDataById(id) {
      // debugger
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: response.message
        })
      }).catch(() => {
         this.$message.info('取消删除')
      })
    },

    //弹出添加或更新的表单
    add(row){
      debugger
      this.dialogTitle = '添加下级节点'
      this.dialogVisible = true

      this.sysData = Object.assign({}, defaultForm)
      this.sysData.id = ''
      if(row) {
        this.sysData.parentId = row.id
        this.sysData.parentName = row.name
      } else {
        this.dialogTitle = '添加目录节点'
        this.sysData.parentId = 0
      }
    },

    //编辑
    edit(row) {
      //debugger
      this.dialogTitle = '修改部门'
      this.dialogVisible = true

      this.sysData = Object.assign({}, row)
    },

    //添加或更新
    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.sysData.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },

    //添加
    save() {
      api.save(this.sysData).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    //更新
    update() {
      api.updateById(this.sysData).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData()
      })
    },

//切换用户状态
    switchStatus(row) {
      row.status = row.status === 1 ? 0 : 1;
      api.updateStatus(row.id, row.status).then((response) => {
        if (response.code) {
          this.$message.success(response.message || "操作成功");
          this.fetchData();
        }
      });
    },


  }
}
</script>
