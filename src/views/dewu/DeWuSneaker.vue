<template>
    <div>
      <el-form inline>
              <el-form-item >
                  <el-input placeholder="请输入商品货号" v-model="queryInfo.code" :clearable="true" @clear="search" @keyup.native.enter="search" size="small" style="min-width: 400px">
                      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
              </el-form-item>
              <el-button  type="primary" icon="el-icon-plus" size="small" @click="openAddSneakersVisble">新增商品</el-button>
          </el-form>
            <el-table :data="DeWuSneakerGoodsList">
                <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
                <el-table-column label="id" prop="id" width="50"></el-table-column>
                <el-table-column label="品牌名称" prop="brandName"  show-overflow-tooltip></el-table-column>
                <el-table-column label="商品名称" prop="name"  show-overflow-tooltip></el-table-column>
                <el-table-column label="商品图" width="100">
                  <template slot-scope="scope">
                      <el-popover placement="right" width="360px" height="200px" trigger="hover" content="....">
                          <div style="width: 320px;height: 200px;">
                            <img style="width: 100%;height: 100%;"
                                  :src="scope.row.imageUrl" />
                          </div>
                          <div slot="reference" style="width: 60px;height: 36px;"><img style="width: 100%;height: 100%;"
                                  :src="scope.row.imageUrl" />
                          </div>
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column label="商品货号" prop="code" ></el-table-column>
                <el-table-column label="操作" width="200">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditSneakersVisble(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDeWuSneakerGoods(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
                           :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
                           layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
  
            <!--新增标签对话框-->
          <el-dialog title="新增商品" width="50%" :visible.sync="dialogAddVisible" :close-on-click-modal="false" destroy-on-close @close="cancelAddVisble">
              <!--内容主体-->
              <el-form  ref="form" :rules="rules" :model="form" label-width="80px">
              <el-form-item label="品牌名称" prop="brandName">
                         <el-input v-model="form.brandName" ></el-input>
              </el-form-item>
              <el-form-item label="商品名称" prop="name">
                         <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="商品货号"  prop="code">
                         <el-input v-model="form.code"></el-input>
              </el-form-item>
              <el-form-item  label="图片链接" prop="imageUrl">
                         <el-input v-model="form.imageUrl"></el-input>
              </el-form-item>
          </el-form>
           <!--底部-->
           <span slot="footer">
                <el-button @click="cancelAddVisble">取 消</el-button>
                <el-button type="primary" @click="addSneakerGoods">确 定</el-button>
            </span>
  
          </el-dialog>
                <!--编辑商品 -->
                <el-dialog title="编辑商品" width="50%" :visible.sync="dialogEditVisible" :close-on-click-modal="false"  @close="cancelEditVisble">
              <!--内容主体-->
              <el-form  ref="form" :rules="rules" :model="form" label-width="80px">
              <el-form-item label="品牌名称" prop="brandName">
                         <el-input v-model="form.brandName" ></el-input>
              </el-form-item>
              <el-form-item label="商品名称" prop="name">
                         <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="商品货号"  prop="code">
                         <el-input v-model="form.code"></el-input>
              </el-form-item>
              <el-form-item  label="图片链接" prop="imageUrl">
                         <el-input v-model="form.imageUrl"></el-input>
              </el-form-item>
          </el-form>
           <!--底部-->
           <span slot="footer">
                <el-button @click="cancelEditVisble">取 消</el-button>
                <el-button type="primary" @click="editDeWuSneakerGoods">确 定</el-button>
            </span>
  
          </el-dialog>
    </div>
  </template>
  
  <script>
      import {getDeWuSneakerGoods} from '@/api/deWuSneaker'
      import {addDeWuSneakerGoods} from '@/api/deWuSneaker'
      import {editDeWuSneakerGoods} from '@/api/deWuSneaker'
      import {deleteDeWuSneakerGoods} from '@/api/deWuSneaker'

  export default {
      name: 'ProductInventory',
      data() {
          return {
                    productList:[],
                    DeWuSneakerGoodsList:[], 
                    total: 0,
                    dialogAddVisible: false,
                    dialogEditVisible: false,
                    queryInfo: {
                        code: '',
                        pageNum: 1,
                        pageSize: 10
                    },
                    form:{
                        id:'',
                        name:'',
                        brandName:'',
                        code:'',
                        imageUrl:'',
                        createTime:''
                    },
                    rules: {
                    brandName: [
						{required: true, message: '请输入商品品牌', trigger: 'blur'},
					],
                    name: [
						{required: true, message: '请输入商品名称', trigger: 'blur'},
					],
                    code: [
						{required: true, message: '请输入商品货号', trigger: 'blur'},
					],
                    imageUrl: [
						{required: true, message: '请输入图片链接', trigger: 'blur'},
					],
				},
            }
          },
      created() {
        this.getDeWuSneakerGoods()
      },
      methods: {
                getDeWuSneakerGoods(){
                    getDeWuSneakerGoods(this.queryInfo).then(res => {
                        this.DeWuSneakerGoodsList = res.data.list
                        this.total = res.data.total
                    })
                },
                search() {
                    this.queryInfo.pageNum = 1
                    this.queryInfo.pageSize = 10
                    this.getDeWuSneakerGoods()
                },
                //监听 pageSize 改变事件
                handleSizeChange(newSize) {
                    this.queryInfo.pageSize = newSize
                    this.getDeWuSneakerGoods()
                },
                //监听页码改变的事件
                handleCurrentChange(newPage) {
                    this.queryInfo.pageNum = newPage
                    this.getDeWuSneakerGoods()
                },
                openAddSneakersVisble() {
                    this.dialogAddVisible = true
                    this.form = {}
                },
                cancelAddVisble() {
                    this.dialogAddVisible = false
                    this.form = {}
                },
                openEditSneakersVisble(row){
                    this.form = row;
                    this.dialogEditVisible = true
                },
                cancelEditVisble() {
                    this.dialogEditVisible = false
                    this.form = {}
                },
                addSneakerGoods(){
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            addDeWuSneakerGoods(this.form).then(res => {
                                this.msgSuccess(res.msg)
                                this.dialogAddVisible = false
                                this.getDeWuSneakerGoods()
                            })
                        } else {
                            this.msgError(res.msg)
                        }
                    })
                },
                editDeWuSneakerGoods(){
                    console.log(this.form)
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            editDeWuSneakerGoods(this.form).then(res => {
                                this.msgSuccess(res.msg)
                                this.dialogEditVisible = false
                                this.getDeWuSneakerGoods()
                            })
                        } else {
                            this.msgError(res.msg)
                        }
                    })
                    },
                deleteDeWuSneakerGoods(id){
                    this.$confirm('确认删除该商品吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteDeWuSneakerGoods(id).then(res => {
                            this.msgSuccess(res.msg)
                            this.getDeWuSneakerGoods()
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
                }
                },
        }
  </script>
  
  <style scoped>
        .el-button + span {
            margin-left: 10px;
        }
    
        .el-form--inline .el-form-item {
          margin-bottom: 0;
       }

       /deep/ .el-divider{
        margin-top: 10px;
       }
       /deep/ .el-dialog__body{
        padding-top: 10px;
    }
  
  </style>