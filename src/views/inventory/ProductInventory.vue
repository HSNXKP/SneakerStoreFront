<template>
    <div>
      <el-form inline>
              <el-form-item >
                  <el-input placeholder="请输入商品货号" v-model="queryInfo.query" :clearable="true" @clear="search" @keyup.native.enter="search" size="small" style="min-width: 400px">
                      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
              </el-form-item>
              <el-button  type="primary" icon="el-icon-plus" size="small" @click="openProductInventoryVisble">新增出价商品</el-button>
          </el-form>
    
            <el-table :data="productInventoryList">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column label="id" prop="id" width="50"></el-table-column>
                <el-table-column label="品牌名称" prop="productName"  show-overflow-tooltip></el-table-column>
                <el-table-column label="商品图" width="100">
                  <template slot-scope="scope">
                      <el-popover placement="right" width="360px" height="200px" trigger="hover" content="....">
                          <div style="width: 380px;height: 200px;"><img style="width: 100%;height: 100%;"
                                  :src="scope.row.image" />
                          </div>
                          <div slot="reference" style="width: 65px;height: 36px;"><img style="width: 100%;height: 100%;"
                                  :src="scope.row.image" />
                          </div>
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column label="商品货号" prop="code"  show-overflow-tooltip></el-table-column>
              <el-table-column label="商品配色" prop="color"  show-overflow-tooltip></el-table-column>
                <el-table-column label="库存数量" prop="quantity" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="200">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="goEditProductInventoryInfo(scope.row.id)">管理库存</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
                           :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
                           layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
  
            <!--添加标签对话框-->
          <el-dialog title="新增出价商品" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancelVisble">
              <!--内容主体-->
              <el-form inline>
              <el-form-item >
                  <el-input placeholder="请输入商品货号或者名称" v-model="productQueryInfo.query" :clearable="true" @clear="searchProduct" @keyup.native.enter="searchProduct" size="small" style="min-width: 200px">
                      <el-button slot="append" icon="el-icon-search" @click="searchProduct"></el-button>
                    </el-input>
              </el-form-item>
          </el-form>
              <el-divider class="divider"></el-divider>
              <el-table :data="productList">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column label="id" prop="id" width="50"></el-table-column>
                <el-table-column label="商品名称" prop="name"  show-overflow-tooltip></el-table-column>
                <el-table-column label="商品图" width="100">
                  <template slot-scope="scope">
                      <el-popover placement="right" width="360px" height="200px" trigger="hover" content="....">
                          <div style="width: 380px;height: 200px;"><img style="width: 100%;height: 100%;"
                                  :src="scope.row.image" />
                          </div>
                          <div slot="reference" style="width: 65px;height: 36px;"><img style="width: 100%;height: 100%;"
                                  :src="scope.row.image" />
                          </div>
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column label="商品货号" prop="code"  show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="200">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="goEditProductInventoryInfo(scope.row.id)">出价</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <!--分页-->
             <el-pagination @size-change="productHandleSizeChange" @current-change="productHandleCurrentChange" :current-page="queryInfo.pageNum"
                           :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="productTotal"
                           layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
  
          </el-dialog>
    </div>
  </template>
  
  <script>
      import {getAllProductInventory} from '@/api/productInventory'
      import {getAllProductByCodeOrName} from '@/api/product'
      
      

  export default {
      name: 'ProductInventory',
      data() {
          return {
                    productList:[],
                    productInventoryList:[], 
                    total: 0,
                    productTotal:0,
                    dialogVisible: false,
                    queryInfo: {
                        query: '',
                        pageNum: 1,
                        pageSize: 10
                    },
                    productQueryInfo: {
                        query: '',
                        pageNum: 1,
                        pageSize: 10
                    },
                }
          },
      created() {
        this.getAllProductInventory()
      },
      methods: {
                getAllProductInventory(){
                    getAllProductInventory(this.queryInfo).then(res => {
                        this.productInventoryList = res.data.list
                        this.total = res.data.total
                    })
                },
                getAllProductByCodeOrName(){
                    getAllProductByCodeOrName(this.productQueryInfo).then(res => {
                        this.productList = res.data.list
                        this.total = res.data.total
                    })
                },
                search() {
                    this.queryInfo.pageNum = 1
                    this.queryInfo.pageSize = 10
                    this.getAllProductInventory()
                },
                searchProduct(){
                    this.queryInfo.pageNum = 1
                    this.queryInfo.pageSize = 10
                    this.getAllProductByCodeOrName()
                },
                //监听 pageSize 改变事件
                handleSizeChange(newSize) {
                    this.queryInfo.pageSize = newSize
                    this.getAllProductInventory()
                },
                //监听页码改变的事件
                handleCurrentChange(newPage) {
                    this.queryInfo.pageNum = newPage
                    this.getAllProductInventory()
                },
                //监听 pageSize 改变事件
                productHandleSizeChange(newSize){
                    this.productQueryInfo.pageSize = newSize
                    this.getAllProductByCodeOrName()
                },
                 //监听页码改变的事件
                productHandleCurrentChange(newPage) {
                    this.productQueryInfo.pageNum = newPage
                    this.getAllProductByCodeOrName()
                },
                openProductInventoryVisble() {
                    this.dialogVisible = true
                },
                cancelVisble() {
                    this.dialogVisible = false
                },
                goEditProductInventoryInfo(id){
                    this.$router.push(`/inventory/productInventoryInfo/${id}`)
                }
            }
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